import axios, { AxiosError, AxiosResponse } from 'axios';
import { AxiosResult, GetProductPage, ProductParseResult } from './types';
import {
  getFirstGroup,
  notAxiosError,
  notEmpty,
  parseStringObjectToJSON,
} from './utils';
import { archivedLinkService } from '../../database/services/archived-links.service';
import { unavailableLinkService } from '../../database/services/unavailable-links.service';
import { ARCHIVED_LINK, AVAILABLE_LINK, UNAVAILABLE_LINK } from './constants';
import { productService } from '../../database/services/product.service';
import Bottleneck from 'bottleneck';

export const processBodyResponse = (
  res: AxiosResponse
): ProductParseResult | null => {
  let data: ProductParseResult | null;
  try {
    const [productInfo] = getFirstGroup(
      /var\s?layer\s?=\s?(.*?[^;]+)/gm,
      res.data.replace(/&\w+;/gm, '')
    ).map((el) => parseStringObjectToJSON(el));

    if (productInfo == null || res.config.url == undefined) {
      data = null;
      console.log(
        `No info was captured in: 'https://allo.ua${res?.request?.path}'`
      );
    }

    data = {
      product: productInfo,
      url: res.config.url,
    } as ProductParseResult;
  } catch (e) {
    data = null;
    console.log(`processBodyResponse: ${e}`);
  }

  return data;
};

export const getProductPage: GetProductPage = async (url) => {
  try {
    return await axios.get(url, {
      maxRedirects: 0,
      headers: {
        'User-Agent': 'python-requests/2.26.0',
        'Accept-Encoding': 'gzip, deflate',
        Accept: '*/*',
        Connection: 'keep-alive',
        'cache-control': 'max-age=0',
        'accept-language': 'en-US,en;q=0.9',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
      },
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
  const [existArchivedLinks, existUnavailableLinks, existAvailableLinks] =
    await Promise.all([
      archivedLinkService.findAll(links),
      unavailableLinkService.findAll(links),
      productService.findAll(links),
    ]);

  return links.filter(
    (link) =>
      ![
        ...existArchivedLinks,
        ...existUnavailableLinks,
        ...existAvailableLinks,
      ].find((el) => el.url === link)
  );
};

const makeQueue = (
  links: string[],
  processLink: GetProductPage
): AxiosResult[] => {
  const limiter = new Bottleneck({
    maxConcurrent: 10,
    minTime: 333,
  });

  return links.map((x) => limiter.schedule(() => processLink(x)));
};

export const scrapProducts = async (productLinks: string[]): Promise<void> => {
  const notExistingLinks = await filterExistingLinks(productLinks);

  console.log('notExistingLinks count: ' + notExistingLinks.length);

  // ~3 request in sec (at this time)
  const step = 180;
  const splittedArrays = Array.from({ length: notExistingLinks.length }, () =>
    notExistingLinks.splice(-step)
  );

  for (const arr of splittedArrays) {
    try {
      console.time('-------------------- one loop ---------------------------');

      console.time('180 requests');
      const data = (await Promise.all(makeQueue(arr, getProductPage)))
        .filter(notAxiosError)
        .map(processBodyResponse)
        .filter(notEmpty);
      console.log(data.length);
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
      await archivedLinkService.saveAll(
        archivedProducts.map((product) => ({
          url: product.url,
          site: global.siteId,
        }))
      );
      await unavailableLinkService.saveAll(
        unavailebleProducts.map((product) => ({
          url: product.url,
          site: global.siteId,
        }))
      );
      await productService.saveAll(
        availableProducts.map((product) => ({
          ...product.product.ecommerce.detail.products[0],
          url: product.url,
          site: global.siteId,
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

  console.log('end');
};
