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
import { ARCHIVED_LINK, UNAVAILABLE_LINK } from './constants';

const saveLink = async (
  url: string,
  { productAvailability }: ProductJSON,
  siteName: string
): Promise<void> => {
  const siteId = await siteService.findByName(siteName);

  switch (productAvailability) {
    case ARCHIVED_LINK:
      await archivedLinkService.save({
        url,
        site: siteId,
      });
      break;
    case UNAVAILABLE_LINK:
      await unavailableLinkService.save({
        url,
        site: siteId,
      });
      break;
    default:
      throw new Error('No one case found for: ' + productAvailability);
  }
};

export const scrapProductInfo = async (
  url: string,
  siteName: string
): Promise<ProductJSON> => {
  const req = await axios
    .get(url, {
      maxRedirects: 0,
    })
    .catch(async err => {
      if (err.response.statusText === 'Moved Permanently') {
        await saveLink(
          url,
          {
            productAvailability: ARCHIVED_LINK,
          } as ProductJSON,
          siteName
        );
        throw new Error('Moved Permanently');
      }
      throw new Error(err);
    });

  const [productInfo] = getFirstGroup(
    /var\s?layer\s?=\s?(.*?[^;]+)/gm,
    req.data.replace(/&\w+;/gm, '')
  ).map(el => parseStringObjectToJSON(el));

  if (productInfo == null) {
    throw new Error(`No info was captured in: ${url}`);
  }

  return productInfo;
};

export const scrapProducts = async (
  productLinks: string[],
  siteName: string
): Promise<void> => {
  //test
  // console.log(productLinks.length);
  // const test = [
  //   'https://allo.ua/ru/materinskie-platy/asus-p7h55-m-pro-lga1156-4xddr3-dimm-1xpci-e-16x-hd-audio-7-1-ethernet-1000-mb-s-hdmi-uatx.html',
  // ];
  // const step = 100;
  // const arrays = Array.from(
  //   { length: Math.ceil(productLinks.length / step) },
  //   () => productLinks.splice(-step)
  // );

  // arrays.forEach(arr => arr.map());
  // console.log(arrays);

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
      const productInfo = await scrapProductInfo(url, siteName);

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
      console.log({
        error: `scrapProducts: ${url} ----------
        ${e}`,
      });
      console.timeEnd('scrap time');
      continue;
    }
  }
};
