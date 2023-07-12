import { BrowserLaunchArgumentOptions, BrowserConnectOptions } from 'puppeteer';

export const configs: BrowserLaunchArgumentOptions & BrowserConnectOptions = {
  headless: false,
  args: ['--use-gl=egl', '--start-fullscreen', '--disable-extensions'],
  ignoreHTTPSErrors: true,
  defaultViewport: null, // dynamic optimization
};
export const defaultPageTimeout = 120000;
export const defaultNavigationTimeout = 180000;
