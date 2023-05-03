import { sitemapMain } from './liba/sitemaps';
import { argv } from './liba/cli';
import { CliOptions } from './types/Options';
import { parseXmls } from './liba/parseXML';

(async (cliArgs: CliOptions): Promise<void> => {
  const { siteConfigFile, headless = false } = cliArgs;

  //TODO: md refactor this (remove global)
  global.siteConfigs = siteConfigFile;
  global.puppeteerOptions = {
    headless,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  };

  try {
    await sitemapMain(false);
    const urls = parseXmls();
    console.log(urls);
  } catch (err) {
    throw new Error(`${err}`);
  }
})(argv);
