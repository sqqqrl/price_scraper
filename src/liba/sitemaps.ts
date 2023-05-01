import puppeteer from 'puppeteer';
import { arrayBufferCheck, getSitemapRegexArray } from '../utils';
import { extractFile, typeChecker, downloadFile } from './lib';
import { xmlFolderPath } from '../config';
import { SitemapConfigObject } from '../types/Sitemap';

export const getSitemapLinks = async ({
  url,
  HTMLContainer,
}: SitemapConfigObject): Promise<string[] | null> => {
  const browser = await puppeteer.launch(global.puppeteerOptions);
  const page = await browser.newPage();

  await page.goto(url + 'sitemap.xml');
  await page.waitForSelector('body');

  const { regex, mod } = getSitemapRegexArray('captureLinks');

  const links = await page.$eval(
    HTMLContainer,
    (selector, { regex, mod }) => {
      const htmlString = selector.outerHTML;
      return htmlString.match(new RegExp(regex, mod));
    },
    { regex, mod }
  );

  await page.close();
  await browser.close();

  return links;
};

export const downloadSitemaps = async (
  links: string[],
  folderPath: string
): Promise<void> => {
  const { regex, mod } = getSitemapRegexArray('renameAfterDistract');

  for (const url of links) {
    try {
      await extractFile(
        typeChecker(
          arrayBufferCheck,
          await downloadFile({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
            maxContentLength: Infinity,
          }),
          'Wrong downloaded data'
        ),
        `${folderPath}/${url.replace(new RegExp(regex), mod)}`
      );
    } catch (err) {
      console.log(`
          Download and extract ${url} was failed. 
          ${err}
        `);
    }
  }
};

export const sitemapMain = async (): Promise<void> => {
  const upadteState = true;
  const { sitemap } = global.siteConfigs;

  if (upadteState) {
    const sitemapUrls = await getSitemapLinks(sitemap);
    if (sitemapUrls) {
      try {
        await downloadSitemaps(sitemapUrls, xmlFolderPath);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
