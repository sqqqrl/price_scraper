import { BrowserLaunchArgumentOptions, BrowserConnectOptions } from 'puppeteer';

export const configs: BrowserLaunchArgumentOptions & BrowserConnectOptions = {
  headless: false,
  args: [
    '--use-gl=egl',
    '--disable-notifications',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--start-fullscreen',
  ],
  ignoreHTTPSErrors: true,
  defaultViewport: null, // dynamic optimization
};
export const defaultPageTimeout = 120000;
export const defaultNavigationTimeout = 180000;
