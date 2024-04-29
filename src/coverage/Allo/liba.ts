import axios, { AxiosResponse } from 'axios';
import { ProductJSON, ProductParseResult } from './types';
import { getFirstGroup, notEmpty, parseStringObjectToJSON } from './utils';
import { archivedLinkService } from '../../database/services/archived-links.service';
import { siteService } from '../../database/services/site.service';
import { unavailableLinkService } from '../../database/services/unavailable-links.service';
import { ARCHIVED_LINK, AVAILABLE_LINK, UNAVAILABLE_LINK } from './constants';
import { productService } from '../../database/services/product.service';
const throttledQueue = require('throttled-queue');
// import { testService } from '../../database/services/test.service';

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

export const processBodyResponse = (
  res: AxiosResponse
): ProductParseResult | null => {
  try {
    const [productInfo] = getFirstGroup(
      /var\s?layer\s?=\s?(.*?[^;]+)/gm,
      res.data.replace(/&\w+;/gm, '')
    ).map(el => parseStringObjectToJSON(el));

    if (productInfo == null || res.config.url == undefined) {
      throw new Error(
        `No info was captured in: 'https://allo.ua${res?.request?.path}'`
      );
    }

    return {
      product: productInfo,
      url: res.config.url,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getProductPage = async (
  url: string,
  siteName: string
): Promise<AxiosResponse> => {
  return axios
    .get(url, {
      maxRedirects: 0,
    })
    .catch(async err => {
      if (err?.response?.statusText === 'Moved Permanently') {
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
};

export const scrapProducts = async (
  productLinks: string[],
  siteName: string
): Promise<void> => {
  // ------- test --------
  // console.log(productLinks.length);
  // const test = [
  //   'https://allo.ua/ru/materinskie-platy/asus-p7h55-m-pro-lga1156-4xddr3-dimm-1xpci-e-16x-hd-audio-7-1-ethernet-1000-mb-s-hdmi-uatx.html',
  // ];

  // const data = await testService.findAll([
  //   'kekkeke',
  //   'kekkeke123',
  //   'kekkeke2',
  //   'kekkeke3',
  //   'kekkeke7',
  //   'kekkeke4',
  //   'kekkeke5',
  //   'kekkeke12',
  // ]);
  // const data = await testService.saveAll([
  //   {
  //     name: 'kekew',
  //     url: 'kekkeke',
  //   },
  //   {
  //     name: 'kekew2',
  //     url: 'kekkeke2',
  //   },
  //   {
  //     name: 'kekew9',
  //     url: 'kekkeke9',
  //   },
  //   {
  //     name: 'kekew19',
  //     url: 'kekkeke19',
  //   },
  // ]);
  // console.log(data);

  ///////////////////////////////////////

  const [existArchivedLinks, existUnavailableLinks] = await Promise.all([
    archivedLinkService.findAll(productLinks),
    unavailableLinkService.findAll(productLinks),
  ]);

  const notExistingLinks = productLinks.filter(
    link =>
      ![...existArchivedLinks, ...existUnavailableLinks].find(
        el => el.url === link
      )
  );
  console.log('notExistingLinks count: ' + notExistingLinks.length);

  try {
    const getAll = async (links: string[]): Promise<AxiosResponse[]> => {
      const throttle = throttledQueue(3, 1000, true);
      return await Promise.all(
        links.map(link =>
          throttle(() => {
            try {
              return getProductPage(link, siteName);
            } catch (e) {
              console.log(e);
              return null;
            }
          })
        )
      );
    };
    // 3 request in sec. so for one min need 180 urls
    const step = 180;
    const splittedArrays = Array.from({ length: notExistingLinks.length }, () =>
      notExistingLinks.splice(-step)
    );

    for (const arr of splittedArrays) {
      try {
        console.time(
          '-------------------- one loop ---------------------------'
        );
        console.time('180 requests');
        const data = (await getAll(arr))
          .map(processBodyResponse)
          .filter(notEmpty);
        console.timeEnd('180 requests');

        const [archivedProducts, unavailebleProducts, availableProducts] = [
          data.filter(
            ({ product }) => product.productAvailability === ARCHIVED_LINK
          ),
          data.filter(
            ({ product }) => product.productAvailability === UNAVAILABLE_LINK
          ),
          data.filter(
            ({ product }) => product.productAvailability === AVAILABLE_LINK
          ),
        ];

        console.time('save 180 items');
        const site = await siteService.findByName(siteName);
        await archivedLinkService.saveAll(
          archivedProducts.map(product => ({
            url: product.url,
            site,
          }))
        );
        await unavailableLinkService.saveAll(
          unavailebleProducts.map(product => ({
            url: product.url,
            site,
          }))
        );
        await productService.saveAll(
          availableProducts.map(product => ({
            ...product.product.ecommerce.detail.products[0],
            url: product.url,
            site,
          }))
        );
        console.timeEnd('save 180 items');
        console.timeEnd(
          '-------------------- one loop ---------------------------'
        );
      } catch (e) {
        console.timeEnd(
          '-------------------- one loop ---------------------------'
        );
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
  }
};
