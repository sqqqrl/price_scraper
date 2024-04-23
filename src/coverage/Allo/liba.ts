import axios from 'axios';
import { ProductJSON } from './types';
import {
  getFirstGroup,
  parseStringObjectToJSON,
  isProductUnavailable,
  isExist,
  isProductArchived,
} from './utils';
import { archivedLinkService } from '../../database/services/archived-links.service';
import { siteService } from '../../database/services/site.service';
import { unavailableLinkService } from '../../database/services/unavailable-links.service';
import { productService } from '../../database/services/product.service';

export const scrapProductInfo = async (url: string): Promise<ProductJSON> => {
  const reqData = (await axios.get(url)).data;
  const [productInfo] = getFirstGroup(
    /var\s?layer\s?=\s?(.*?[^;]+)/gm,
    reqData
  ).map(el => parseStringObjectToJSON(el));

  if (productInfo == null) {
    throw new Error(`No info was captured in: ${url}`);
  }

  return productInfo;
};

const saveLink = async (
  url: string,
  { productAvailability }: ProductJSON,
  siteName: string
): Promise<void> => {
  const siteId = await siteService.findByName(siteName);

  switch (productAvailability) {
    case 'archival':
      await archivedLinkService.save({
        url,
        site: siteId,
      });
      break;
    case 'unavailable':
      await unavailableLinkService.save({
        url,
        site: siteId,
      });
      break;
    default:
      throw new Error('No one case found for: ' + productAvailability);
  }
};

export const scrapProducts = async (
  productLinks: string[],
  siteName: string
): Promise<void> => {
  for (const url of productLinks) {
    try {
      console.time('scrap time');
      //check link in db. mb it alredy scraped before
      if (await isExist(url)) {
        console.log(`alredy scraped before`);
        console.timeEnd('scrap time');
        continue;
      }

      //get product information from site and parse it to json
      const productInfo = await scrapProductInfo(url);

      //check product availability and put in db if not available or archived
      if (isProductUnavailable(productInfo) || isProductArchived(productInfo)) {
        console.log(`start save not available or archived link`);
        await saveLink(url, productInfo, siteName);
        console.timeEnd('scrap time');
        continue;
      }

      console.log(
        `---------------start save product data-----------------------`
      );
      await productService.save({
        ...productInfo.ecommerce.detail.products[0],
        url,
        site: await siteService.findByName(siteName),
      });

      console.timeEnd('scrap time');
    } catch (e) {
      throw new Error('kekw: ' + e);
    }
  }
};
