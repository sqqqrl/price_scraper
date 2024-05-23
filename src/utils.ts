import { DIST_FOLDER } from './config';
import { Exports } from './types/Options';
import { RegexObject, SiteConfig } from './types/Sitemap';
import { resolve, parse } from 'path';

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
  const obj = regexArray.find((el) => el.purpose === purpose);
  if (obj) {
    return obj;
  }

  throw new Error(`${purpose} is undefined`);
};

export const getExport = async (path: string): Promise<Exports> => {
  const { dir, name } = parse(path);
  return await import(resolve(`${DIST_FOLDER}${dir}/${name}.js`));
};

export const randTimeout = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

export const notEmpty = <TValue>(
  value: TValue | null | undefined
): value is TValue => value !== null && value !== undefined;

// export const getFirstGroup = (regex: RegExp, str: string): string[] => {
//   return Array.from(str.matchAll(regex), (m) => m[1]);
// };
// export const parseStringObjectToJSON = (objString: string): any => {
//   if (typeof objString != 'string') {
//     return null;
//   }
//   return JSON.parse(JSON.stringify(eval('(' + objString + ')')));
// };
// export const notAxiosError = <T>(element: T | AxiosError): element is T => {
//   return !isAxiosError(element);
// };
