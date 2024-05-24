# Price scraper

## How it works



First of all needs links. Best way get it throw `https://site.ua/robots.txt` => `sitemap.xml`.
The sitemap has all indexed URLs.

To start scraping URLs at this stage, you need to do 2 things (required):

1) Create `Suite` class and import inside `/CoverageSiteName/index.ts` file.
2) Create `sitemapLinksScrapper` (`SitemapLinksScrapper` type) function and import inside `/CoverageSiteName/index.ts` file.

At this point, run npm script [`sitemaps`](#commands).

Now all sitemaps are stored inside `xmls` folder.

## Commands
`npm run %script name & args %`


- `start`

    Run suite actions
    
    `options ( argv )`:

    `-s` / `--suite`: provide a path to coverage suite (__required__)

    `-h` / `--headless`: run with puppeteer headless mode (__optional__)

    `npm run start -- -s="./src/coverage/Allo/index.ts" --headless`

- `sitemaps`

    Scraping sitemap URLs for provided site

    `options ( argv )`:

    `-p` / `--coveragePath`: provide a path to coverage sitemap scraper (__required__)

    `-h` / `--headless`: run with puppeteer headless mode (__optional__)

    `npm run sitemaps -- -p="./src/coverage/Allo/index.ts" -h`