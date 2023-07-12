import { argv } from './liba/cli';
import { CliOptions } from './types/Options';
import { configs } from './puppeteer.config';
import { getExport } from './utils';
import { controller } from './liba/controller';

(async (cliArgs: CliOptions): Promise<void> => {
  const { suite, headless = false } = cliArgs;
  console.log(suite);

  const importedSuite = (await getExport(suite)).default.suite;

  configs.headless = headless;

  const kekw = controller(importedSuite);
  console.log(kekw);

  // try {
  //   await sitemapMain(false);
  //   // const urls = parseXmls();
  //   // console.log(urls);
  //   const urls = [
  //     'https://allo.ua/ru/products/notebooks/noutbuk-acer-aspire-5-a515-45-nx-a83eu-014.html',
  //     'https://allo.ua/ru/products/mobile/apple-iphone-14-pro-max-256gb-space-black.html',
  //     'https://allo.ua/ru/smart-chasy/apple-watch-ultra-gps-cellular-49mm-titanium-case-with-green-alpine-loop-medium-mqfn3ul-a.html',
  //   ];

  //   console.log(urls);
  // } catch (err) {
  //   throw new Error(`${err}`);
  // }
})(argv);
