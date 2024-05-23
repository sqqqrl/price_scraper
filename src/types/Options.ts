import { Suite } from '../liba/wrappers/suite';

export type SitemapLinksScrapper = (sitemapUrl: string) => Promise<string[]>;

export type CliOptions = {
  suite: string;
  headless?: boolean;
};

export type Exports = {
  default: {
    suite: Suite;
    sitemapLinksScrapper: SitemapLinksScrapper;
    [key: string]: Suite | SitemapLinksScrapper;
  };
} & {
  [k: string]: unknown;
};
