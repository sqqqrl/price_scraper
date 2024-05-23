import { logger } from '../../../liba/logger';
import { getArchiveLinks } from '../../../sitemap/puppeteer';
import { SitemapLinksScrapper } from '../../../types/Options';

export const sitemapLinksScrapper: SitemapLinksScrapper = async (
  sitemapUrl
) => {
  try {
    return await getArchiveLinks({
      sitemapUrl,
      HTMLContainer: 'body > div#webkit-xml-viewer-source-xml',
      regex:
        /https:\/\/allo\.ua\/map\/secure\/categories\/sitemap\d+\.xml\.gz/g,
    });
  } catch (err) {
    logger.error('error', new Error(`${err}`));
    throw new Error(`${err}`);
  }
};
