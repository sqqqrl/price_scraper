import { xmlFolderPath } from '../../config';
import { parseXmls } from '../../liba/parseXML';
import {
  defineCategories,
  sortLinksByCategories,
} from '../../liba/wrappers/links';
import {
  downloadAndExtactArchive,
  getArchiveLinks,
} from '../../liba/wrappers/sitemap';
import { SuiteProperties } from '../../liba/wrappers/suite';

type GetArchiveLinksFromSitemap = (
  sitemapUrl: SuiteProperties
) => Promise<string[]>;

export const getArchiveLinksFromSitemap = async ({
  sitemapUrl,
}): Promise<string[]> => {
  const archiveLinks: string[] = [];

  try {
    (
      await getArchiveLinks({
        sitemapUrl,
        HTMLContainer: 'body > div#webkit-xml-viewer-source-xml',
        regex: /https:\/\/allo\.ua\/map\/secure\/products\/sitemap\d+\.xml\.gz/g,
      })
    ).forEach(archiveLink => archiveLinks.push(archiveLink));
  } catch (err) {
    console.log(err);
  }

  return archiveLinks;
};

export const downloadSitemaps = (func: GetArchiveLinksFromSitemap) => async (
  props: SuiteProperties
): Promise<void> => {
  const links = await func(props);
  for (const url of links) {
    const archiveName = url.match(/sitemap\d+\.xml/);
    if (archiveName == null) throw new Error(`mb its not sitemap?????`);

    await downloadAndExtactArchive(
      url,
      `${xmlFolderPath}/allo/${archiveName[0]}`
    );
  }
};

export const collectProductLinks = ({ xmlFolder }: SuiteProperties): any => {
  const result = [];

  try {
    const productLinks = parseXmls(xmlFolder);
    const categories = defineCategories(productLinks);
    const sortedLinksByCategories = sortLinksByCategories(
      categories,
      productLinks
    );
    console.log(sortedLinksByCategories);
  } catch (e) {
    console.log(e);
  }

  return result;
};
