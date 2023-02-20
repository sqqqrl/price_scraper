import puppeteer from 'puppeteer';

import { siteUrl } from './config.js';

(async () => {

    // TODO: add cli params for headless mode
    const options = {
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 1080,
        }
    };


    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();

    await page.goto(siteUrl);

    await browser.close();
})();