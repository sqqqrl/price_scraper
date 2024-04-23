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
  } catch (e) {
    console.log('INIT DB ERROR: ' + e);
  }

  return;
};

export const start = async ({
  xmlFolder,
  siteName,
}: SuiteProperties): Promise<void> => {
  const productLinks = parseXmls(xmlFolder)
    .flat()
    .slice(0, 100);

  await scrapProducts(productLinks, siteName);

  return;
};
