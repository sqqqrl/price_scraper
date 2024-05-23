// import puppeteer from 'puppeteer';

// const scrapCatName = async (url: string): Promise<string | null> => {
//   const browser = await puppeteer.launch(global.puppeteerOptions);
//   const page = await browser.newPage();

//   await page.goto(url);
//   await page.waitForSelector('.v-catalog__title');

//   const catName = await page.$eval(
//     '.v-catalog__title',
//     data => data.textContent
//   );

//   await page.close();
//   await browser.close();

//   return catName;
// };

// export const categories = async (
//   translitNames: string[]
// ): Promise<string[]> => {
//   const { url } = global.siteConfigs;
//   const names: string[] = [];

//   for (const translitName of translitNames) {
//     const name = await scrapCatName(url + translitName);
//     if (name !== null) {
//       names.push(name);
//     }
//   }

//   return names;
// };
