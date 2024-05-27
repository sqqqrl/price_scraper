import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import anonymizeUa from 'puppeteer-extra-plugin-anonymize-ua';
import { configs } from '../../../puppeteer.config';
import UserAgent from 'user-agents';
import { setTimeout } from 'node:timers/promises';
import { ProductDto } from '../../../database/models/product_allo.model';
import { productServiceAllo } from '../../../database/services/product_allo.service';
import { ProductList } from './types';
import { logger } from '../../../liba/logger';
import { categoryService } from '../../../database/services/category.service';
import { Browser } from 'puppeteer';
import { randTimeout } from '../../../utils';

// set up plugins
puppeteer.use(StealthPlugin());
puppeteer.use(anonymizeUa());

const genUA = (): string =>
  new UserAgent({ deviceCategory: 'desktop' }).toString();

//removes duplicate links with the city param
export const removeCityLinks = (links: string[]): string[] => {
  //example: https://site.ua/ru/category-name/
  const clear = /^https:\/\/\w+\.\w+\/\w+\/[a-zA-Z0-9-]+[^\/]\/$/;
  //example: https://site.ua/ru/products/category-name/
  const withProductsParam =
    /^https:\/\/\w+\.\w+\/\w+\/products\/[a-zA-Z0-9-]+[^\/]\/$/;

  return links.filter(
    (link) => link.match(clear) || link.match(withProductsParam)
  );
};

const scrapProducts = async (
  browser: Browser,
  link: string
): Promise<ProductDto[]> => {
  const result: ProductDto[] = [];

  const defaultPage = (await browser.pages())[0];
  await defaultPage.setUserAgent(genUA());
  await defaultPage.goto(link, {
    waitUntil: 'domcontentloaded',
  });

  await setTimeout(randTimeout(2000, 3500));

  let isEnd = false;
  while (!isEnd) {
    // scrap products info from state
    try {
      const { pagination, products } = (await defaultPage.evaluate(
        `window.__ALLO__.state['catalog/category/product-list']`
      )) as ProductList;
      logger.info('info', { data: { pagination } });

      if (!pagination || !products) {
        logger.error('error', new Error('Category page is empty'));
        isEnd = true;
        break;
      }

      result.push(
        ...products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          rating: product.rating,
          url: product.url,
        }))
      );

      if (
        pagination.current_page ===
        Math.ceil(pagination.total_number_of_items / pagination.items_per_page)
      ) {
        isEnd = true;
        break;
      }

      await defaultPage.goto(`${link}/p-${pagination.current_page + 1}`, {
        waitUntil: 'domcontentloaded',
      });
      await setTimeout(randTimeout(2000, 3500));
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  return result;
};

//if a category was scrapped earlier, the function will remove it from the array
const filterExistingCategories = async (links: string[]): Promise<string[]> => {
  const exists = (await categoryService.findAll(links)).map(
    (category) => category.url
  );

  return links.filter((link) => !exists.includes(link));
};

export const processLinks = async (links: string[]): Promise<void> => {
  //TODO: add an option in cli (--update) to "rescrap" categories
  const update = false;

  const categoryLinks = update ? links : await filterExistingCategories(links);
  const browser = await puppeteer.launch(configs);

  for (const link of categoryLinks) {
    try {
      logger.log(
        'info',
        `${links.indexOf(link) + 1} of ${links.length} category processing.`
      );
      logger.log('info', `Starting scrap category link: ${link}`);

      const products = await scrapProducts(browser, link);

      logger.log(
        'info',
        `Start saving products info in db. Count: ${products.length}`
      );

      await productServiceAllo.saveAll(products);
      await categoryService.save({
        url: link,
        site: global.siteId,
        scrappedBefore: true,
      });

      logger.log('info', 'Complete saving');
    } catch (err) {
      logger.error('error', new Error(`${err}`));
    }
  }
  await browser.close();
  return;
};
