import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { setTimeout } from 'node:timers/promises';
import Bottleneck from 'bottleneck';
import { Browser } from 'puppeteer';
import anonymizeUa from 'puppeteer-extra-plugin-anonymize-ua';
import { configs } from '../../puppeteer.config';
import UserAgent from 'user-agents';

const makeQueue = (arr: string[], browser: Browser, func: any) => {
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1500,
  });

  return arr.map((x) => limiter.schedule(() => func(x, browser)));
};

const genUA = (): string =>
  new UserAgent({ deviceCategory: 'desktop' }).toString();

const randTimeout = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

const scrapHead = async (
  link: string,
  browser: Browser
): Promise<string | undefined> => {
  const a = performance.now();
  const defaultPage = (await browser.pages())[0];
  await defaultPage.setUserAgent(genUA());
  await defaultPage.goto(link, {
    waitUntil: 'domcontentloaded',
  });
  await setTimeout(randTimeout(2000, 3500));
  const searchValue = await defaultPage.evaluate(() => {
    const head = document.querySelector('head')?.innerText;
    return head;
  });
  const b = performance.now();
  console.log(b - a);
  if (!searchValue) {
    console.log(`searchValue for ${link} is null`);
  }
  return searchValue;
};

export const startPup = async (links: string[]): Promise<unknown[]> => {
  puppeteer.use(StealthPlugin());
  puppeteer.use(anonymizeUa());
  const browser = await puppeteer.launch(configs);
  //   const results: string[] = [];
  const kekw = links.slice(0, 20);
  const a = performance.now();
  const data = await Promise.all(makeQueue(kekw, browser, scrapHead));
  const b = performance.now();
  console.log(b - a);

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
