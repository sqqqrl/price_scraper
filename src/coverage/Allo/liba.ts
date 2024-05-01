import axios, { AxiosError, AxiosResponse } from 'axios';
import { AxiosResult, GetProductPage, ProductParseResult } from './types';
import {
  getFirstGroup,
  notAxiosError,
  notEmpty,
  parseStringObjectToJSON,
} from './utils';
import { archivedLinkService } from '../../database/services/archived-links.service';
import { siteService } from '../../database/services/site.service';
import { unavailableLinkService } from '../../database/services/unavailable-links.service';
import { ARCHIVED_LINK, AVAILABLE_LINK, UNAVAILABLE_LINK } from './constants';
import { productService } from '../../database/services/product.service';
import Bottleneck from 'bottleneck';

export const processBodyResponse = (res: AxiosResponse): ProductParseResult => {
  try {
    const [productInfo] = getFirstGroup(
      /var\s?layer\s?=\s?(.*?[^;]+)/gm,
      res.data.replace(/&\w+;/gm, '')
    ).map((el) => parseStringObjectToJSON(el));

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
    throw new Error(`processBodyResponse: ${e}`);
  }
};

export const getProductPage: GetProductPage = async (url) => {
  try {
    return await axios.get(url, {
      maxRedirects: 0,
    });
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      err.response?.statusText === 'Moved Permanently'
    ) {
      console.log('Save Moved Permanently link:' + url);
      await archivedLinkService.save({
        url,
        site: global.siteId,
      });
    }
    console.log(`${err}`);
    return err as AxiosError;
  }
};

const filterExistingLinks = async (links: string[]): Promise<string[]> => {
  const [existArchivedLinks, existUnavailableLinks] = await Promise.all([
    archivedLinkService.findAll(links),
    unavailableLinkService.findAll(links),
  ]);

  return links.filter(
    (link) =>
      ![...existArchivedLinks, ...existUnavailableLinks].find(
        (el) => el.url === link
      )
  );
};

const makeQueue = (
  links: string[],
  processLink: GetProductPage
): AxiosResult[] => {
  const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 200,
  });

  return links.map((x) => limiter.schedule(() => processLink(x)));
};

export const scrapProducts = async (
  productLinks: string[],
  siteName: string
): Promise<void> => {
  const notExistingLinks = await filterExistingLinks(productLinks);
  // const testLink = [
  //   'https://allo.ua/ru/products/mobile/samsung-c170-6227.html',
  // ];

  console.log('notExistingLinks count: ' + notExistingLinks.length);
  try {
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

        const data = await Promise.all(makeQueue(arr, getProductPage));

        console.timeEnd('180 requests');
        console.time('180 processed');
        const processedData = data
          .filter(notAxiosError)
          .map(processBodyResponse)
          .filter(notEmpty);
        console.timeEnd('180 processed');

        const [archivedProducts, unavailebleProducts, availableProducts] = [
          processedData.filter(
            ({ product }) => product.productAvailability === ARCHIVED_LINK
          ),
          processedData.filter(
            ({ product }) => product.productAvailability === UNAVAILABLE_LINK
          ),
          processedData.filter(
            ({ product }) => product.productAvailability === AVAILABLE_LINK
          ),
        ];

        console.time('save 180 items');
        const site = await siteService.findByName(siteName);
        await archivedLinkService.saveAll(
          archivedProducts.map((product) => ({
            url: product.url,
            site,
          }))
        );
        await unavailableLinkService.saveAll(
          unavailebleProducts.map((product) => ({
            url: product.url,
            site,
          }))
        );
        await productService.saveAll(
          availableProducts.map((product) => ({
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

  console.log('end');
};
