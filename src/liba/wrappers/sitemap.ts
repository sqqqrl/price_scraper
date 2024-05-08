import puppeteer from 'puppeteer';
import { SitemapConfig } from '../../types/Sitemap';
import { configs } from '../../puppeteer.config';
import { isArrayBuffer } from '../../utils';
import { writeFile, typeChecker, downloadFile } from '../lib';

export const getArchiveLinks = async ({
  sitemapUrl,
  HTMLContainer,
  regex,
}: SitemapConfig): Promise<string[]> => {
  const browser = await puppeteer.launch(configs);
  const page = await browser.newPage();

  await page.goto(sitemapUrl);
  await page.waitForSelector('body');

  const html = await page.$eval(HTMLContainer, (selector) => {
    return selector.outerHTML;
  });

  const links = html.match(regex);

  await page.close();
  await browser.close();

  if (links === null || links.length === 0)
    throw new Error(`No one acrive link was found in ${sitemapUrl}`);

  return links;
};

export const downloadAndExtactArchive = async (
  url: string,
  path: string
): Promise<void> =>
  await writeFile(
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
    path
  );
