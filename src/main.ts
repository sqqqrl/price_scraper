import puppeteer, { Page } from 'puppeteer';

import { siteUrl } from './config.js';

interface Categories {
  name: string;
  link: string;
}

export const getCategories = async (page: Page): Promise<Categories[]> => {
  const data: Categories[] = [];

  const catalogBtn = await page.waitForSelector('.mh-catalog-btn');
  if (catalogBtn) {
    await catalogBtn.click();
    const list = await catalogBtn.$$('.mm__list li.mm__item');

    for (const element of list) {
      const textContent = await element.$eval('a.mm__a', el => ({
        name: el.text.replace(/\n/g, '').trim(),
        link: el.href,
      }));
      data.push(textContent);
    }
  }

  return data;
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

  //   await browser.close();

  console.log(list);
})();
