import puppeteer from 'puppeteer';
import { isArrayBuffer, getRegexObjectFromSitemap } from '../utils';
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

  const { regex, mod } = getRegexObjectFromSitemap('captureLinks');

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
  const { regex, mod } = getRegexObjectFromSitemap('renameAfterDistract');

  for (const url of links) {
    try {
      await extractFile(
        typeChecker(
          isArrayBuffer,
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

// TODO: refactor
export const sitemapMain = async (updateState: boolean): Promise<void> => {
  const { sitemap } = global.siteConfigs;

  if (updateState) {
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
