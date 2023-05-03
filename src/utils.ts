import { RegexObject, SiteConfig } from './types/Sitemap';

export const clearString = (str: string): string =>
  str.replace(/\n/g, '').trim();

export const isArrayBuffer = (value: any): boolean =>
  value &&
  value.buffer instanceof ArrayBuffer &&
  value.byteLength !== undefined;

export const getRegexObjectFromSitemap = (purpose: string): RegexObject => {
  const {
    sitemap: { regexArray },
  }: SiteConfig = global.siteConfigs;
  const obj = regexArray.find(el => el.purpose === purpose);
  if (obj) {
    return obj;
  }

  throw new Error(`${purpose} is undefined`);
};
