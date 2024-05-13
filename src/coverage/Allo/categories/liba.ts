import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import anonymizeUa from 'puppeteer-extra-plugin-anonymize-ua';
import { configs } from '../../../puppeteer.config';
import UserAgent from 'user-agents';
import { setTimeout } from 'node:timers/promises';
import { ProductDto } from '../../../database/models/product_allo.model';
import { productServiceAllo } from '../../../database/services/product_allo.service';
import { ProductList } from '../types';
import { logger } from '../../../liba/logger';

puppeteer.use(StealthPlugin());
puppeteer.use(anonymizeUa());

const genUA = (): string =>
  new UserAgent({ deviceCategory: 'desktop' }).toString();

const randTimeout = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

const scrapProducts = async (link: string): Promise<ProductDto[]> => {
  const browser = await puppeteer.launch(configs);
  const defaultPage = (await browser.pages())[0];

  await defaultPage.setUserAgent(genUA());
  const result: ProductDto[] = [];

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
      logger.error('error', new Error(`${err}`));
    }
  }

  return result;
};

export const processLinks = async (links: string[]): Promise<void> => {
  for (const link of links) {
    try {
      logger.error('error', new Error('rlerlw'));
      logger.log(
        'info',
        `${links.indexOf(link) + 1} of ${links.length} category processing.`
      );
      logger.log('info', `Starting scrap category link: ${link}`);
      const a = performance.now();
      const products = await scrapProducts(link);
      const b = performance.now();
      logger.log('info', `time spent on scrap: ${b - a}`);
      logger.log(
        'info',
        `Start saving products info in db. Count: ${products.length}`
      );
      await productServiceAllo.saveAll(products);
      logger.log('info', 'Complete saving');
    } catch (err) {
      logger.error('error', new Error(`${err}`));
    }
  }
  return;
};
