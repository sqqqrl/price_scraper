// import puppeteer from 'puppeteer';

// export const scrapProductInfo = async (url: string): Promise<void> => {
//   const browser = await puppeteer.launch(global.puppeteerOptions);
//   const page = await browser.newPage();

//   const { site } = global.siteConfigs;

//   await page.goto(url);

//   await page.waitForSelector('.p-trade__stock-label');

//   const catName = await page.$eval(
//     '.v-catalog__title',
//     data => data.textContent
//   );

//   await page.close();
//   await browser.close();

//   //   return catName;
// };
