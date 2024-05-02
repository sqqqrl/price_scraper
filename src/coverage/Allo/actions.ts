import { siteService } from '../../database/services/site.service';
import { parseXmls } from '../../liba/parseXML';
import { SuiteProperties } from '../../liba/wrappers/suite';
import { scrapProducts } from './liba';

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
  // const productLinks = parseXmls(xmlFolder).flat();
  const sitemaps = parseXmls(xmlFolder);

  for (const sitemap of sitemaps) {
    await scrapProducts(sitemap);
  }

  console.log('------- scrapping ends ---------');

  return;
};
