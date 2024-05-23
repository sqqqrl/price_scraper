import { downloadAndExtactArchive } from '../liba/lib';
import { logger } from '../liba/logger';
import { configs } from '../puppeteer.config';
import { getExport } from '../utils';
import { argv } from './cli';
import { CliSitemapOptions } from './types';

(async (props: CliSitemapOptions): Promise<void> => {
  const { coveragePath, headless = false } = props;

  //set puppeteer configs
  configs.headless = headless;

  const { suite, sitemapLinksScrapper } = (await getExport(coveragePath))
    .default;

  const { sitemapUrl, xmlFolder } = suite.props;

  const links = await sitemapLinksScrapper(sitemapUrl);

  try {
    await Promise.all(
      links.map((link) => {
        const fileName = link.replace(
          /https?:\/\/[^\/]+(?:\/[^\/]+)*\/([^\/]+\.xml)(?:\.gz)?/g,
          '$1'
        );
        return downloadAndExtactArchive(link, xmlFolder + fileName);
      })
    );
    logger.info('Successfully downloaded sitemaps.');
    process.exit(0);
  } catch (err) {
    logger.error('error', new Error(`${err}`));
    process.exit(1);
  }
})(argv);
