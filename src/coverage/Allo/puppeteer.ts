import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { setTimeout } from 'node:timers/promises';
import Bottleneck from 'bottleneck';
import { Browser } from 'puppeteer';

const makeQueue = (arr: string[], browser: Browser, func: any) => {
  const limiter = new Bottleneck({
    maxConcurrent: 3,
    minTime: 3000,
  });

  return arr.map((x) => limiter.schedule(() => func(x, browser)));
};

const scrapHead = async (
  link: string,
  browser: Browser
): Promise<string | undefined> => {
  const a = performance.now();
  const page = await browser.newPage();
  await page.goto(link, {
    waitUntil: 'domcontentloaded',
  });
  await setTimeout(3000);
  const searchValue = await page.evaluate(() => {
    const head = document.querySelector('head')?.innerText;
    return head;
  });
  await page.close();
  const b = performance.now();
  console.log(b - a);
  if (!searchValue) {
    console.log(`searchValue for ${link} is null`);
  }
  return searchValue;
};

export const startPup = async (links: string[]): Promise<unknown[]> => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch(global.puppeteerOptions);
  //   const results: string[] = [];
  const kekw = links.slice(0, 20);
  const a = performance.now();
  const data = await Promise.all(makeQueue(kekw, browser, scrapHead));
  const b = performance.now();
  console.log(b - a);

  console.log(data);

  //   for (const link of links) {
  //     const a = performance.now();
  //     const page = await browser.newPage();
  //     await page.goto(link, {
  //       waitUntil: 'domcontentloaded',
  //     });
  //     await setTimeout(1500);
  //     const searchValue = await page.evaluate(() => {
  //       const head = document.querySelector('head')?.innerText;
  //       return head;
  //     });

  //     const b = performance.now();
  //     console.log(b - a);
  //     if (!searchValue) {
  //       console.log(`searchValue for ${link} is null`);
  //       continue;
  //     }
  //     results.push(searchValue);
  //   }

  return data;
};
