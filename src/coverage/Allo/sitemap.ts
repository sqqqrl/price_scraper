import {
  getArchiveLinks,
  downloadAndExtactArchive,
} from '../../liba/wrappers/sitemap';
import { SuiteProperties } from '../../liba/wrappers/suite';
import { SitemapScrapper } from './types';

const setTypeOfSitemap = (type: string): string =>
  `https:\/\/allo\.ua\/map\/secure\/${type}\/sitemap\\d+\.xml\.gz`;

export const sitemapScrapper: SitemapScrapper = async (
  sitemapUrl,
  sitemapType
) => {
  try {
    return await getArchiveLinks({
      sitemapUrl,
      HTMLContainer: 'body > div#webkit-xml-viewer-source-xml',
      regex: new RegExp(setTypeOfSitemap(sitemapType), 'g'),
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const downloadSitemaps =
  (func: SitemapScrapper, sitemapType: string) =>
  async ({ sitemapUrl, xmlFolder }: SuiteProperties): Promise<void> => {
    const sitemaps = await func(sitemapUrl, sitemapType);

    if (!sitemaps) {
      throw new Error(`Sitemaps are not scrapped: ${sitemaps}`);
    }
    try {
      await Promise.all(
        sitemaps.map((sitemap) =>
          downloadAndExtactArchive(
            sitemap,
            xmlFolder + sitemapType + '/' + sitemap.match(/sitemap\d+\.xml/)
          )
        )
      );
    } catch (err) {
      throw new Error(`Sitemaps are not donwloaded: ${err}`);
    }
  };
