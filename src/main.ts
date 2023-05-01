import { readFileSync } from 'fs';
import { SiteConfig } from './types/Sitemap';
import { sitemapMain } from './liba/sitemaps';

// will be added to logger
const setJsonConfigs = (site: string): any => {
  try {
    const jsonConfigs = JSON.parse(
      readFileSync(`./sites/${site}.json`).toString()
    );

    return jsonConfigs;
  } catch (err) {
    throw new Error(`
    -----------------------
    Failed to open site config file:
    -----------------------
    ${err}`);
  }
};

(async (): Promise<void> => {
  // TODO: add cli
  const cliOptions = {
    site: 'allo',
  };
  const siteConfigs: SiteConfig = setJsonConfigs(cliOptions.site);

  global.siteConfigs = siteConfigs;
  global.puppeteerOptions = {
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  };

  await sitemapMain();
})();
