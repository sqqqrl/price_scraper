export type SiteConfig = {
  url: string;
  title: string;
  sitemap: SitemapConfigObject;
};

export type SitemapConfigObject = {
  url: string;
  HTMLContainer: string;
  regexArray: RegexObject[];
};

export type RegexObject = {
  purpose: string;
  regex: string;
  mod: string;
};
