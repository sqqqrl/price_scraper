import { AxiosError, isAxiosError } from 'axios';
export const getFirstGroup = (regex: RegExp, str: string): string[] => {
  return Array.from(str.matchAll(regex), (m) => m[1]);
};

// export const parseStringObjectToJSON = (objString: string): any => {
//   if (typeof objString != 'string') {
//     return null;
//   }
//   return JSON.parse(JSON.stringify(eval('(' + objString + ')')));
// };
export const randTimeout = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

export const notEmpty = <TValue>(
  value: TValue | null | undefined
): value is TValue => value !== null && value !== undefined;

export const notAxiosError = <T>(element: T | AxiosError): element is T => {
  return !isAxiosError(element);
};
