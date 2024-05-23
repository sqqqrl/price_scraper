import { siteService } from '../../../database/services/site.service';
import { parseXmlByFilename } from '../../../liba/parseXML';
import { SuiteProperties } from '../../../liba/wrappers/suite';
import { filterDublicateCategories, processLinks } from './categories';

export const initSiteCollection = async ({
  siteName,
  url,
}: SuiteProperties): Promise<void> => {
  try {
    if (!(await siteService.existsByName(siteName))) {
      siteService.save({
        name: siteName,
        url,
      });
    }

    global.siteId = await siteService.findByName(siteName);
  } catch (e) {
    console.log('INIT DB ERROR: ' + e);
  }

  return;
};

export const start = async ({ xmlFolder }: SuiteProperties): Promise<void> => {
  // the first sitemap (#1, #101, #201, #301, #401, #501, #601 and #701 ) consists of clear categories
  // without filter(like discount/brand etc..)
  // so it make sense scrap only them

  // TODO: some fixes after research more about them
  // research:
  //    each clear category can reproduce a maximum of 1400 products (in many ways this is not complete information)
  //    so still need other sitemaps with filtres

  const mainSitemaps = [1, 101, 201, 301, 401, 501, 601, 701];

  const results: string[][] = [];
  for (const number of mainSitemaps) {
    const sitemap = parseXmlByFilename(xmlFolder, `sitemap${number}.xml`);

    results.push(filterDublicateCategories(sitemap));
  }

  await processLinks(results.flat());

  return;
};
