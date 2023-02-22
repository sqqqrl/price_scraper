import puppeteer, { Page } from 'puppeteer';
import { Result } from 'true-myth';

import { siteUrl } from './config.js';
import { parseTagA } from './liba/parsers.js';
import { ParseResult, PuppeteerParserResult } from './types/Result.js';

interface Category {
  selector: HTMLAnchorElement;
  name: string;
  link: string;
}

type PuppeteerParser<T> = (input: any) => PuppeteerParserResult<T>;

export const arrayParser = <A>(
  parser: PuppeteerParser<A>
): PuppeteerParser<A> => async (input: any[]): PuppeteerParserResult<A> => {
  const results: ParseResult<A>[] = await Promise.all(input.map(parser));

  const failed = results.filter(Result.isErr);
  const success = results.filter(Result.isOk);

  return failed.length > 0
    ? Result.err({
        error: failed,
      })
    : Result.ok({
        data: success.flatMap(({ value }) => value.data),
      });
};

export const getCategories = async (page: Page): Promise<any> => {
  const data: Category[] = [];

  const catalogBtn = await page.waitForSelector('.mh-catalog-btn');
  if (catalogBtn) {
    await catalogBtn.click();
    const list = await catalogBtn.$$('.mm__list li.mm__item');
    const parsedList = await arrayParser(parseTagA)(list);
    if (parsedList.isOk()) {
      return Result.ok({
        data: parsedList.value.data,
      });
    }
  }

  return Result.err({
    error: data,
  });
};

(async (): Promise<void> => {
  // TODO: add cli params for headless mode
  const options = {
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  };

  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();
  await page.goto(siteUrl);

  const list = await getCategories(page);

  // const sub = arrayParser(getSubcategories);
  //   await browser.close();

  console.log(list);
})();
