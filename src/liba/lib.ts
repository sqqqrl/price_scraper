import { writeFileSync } from 'fs';
import { ungzip } from 'node-gzip';
import { CheckerFunc } from '../types/TypeChecker';
import axios, { AxiosRequestConfig } from 'axios';

export const typeChecker = (f: CheckerFunc, data: any, err: string): any => {
  const check = f(data);
  if (check) {
    return data;
  }

  throw new Error(err);
};

export const downloadFile = async (
  options: AxiosRequestConfig
): Promise<ArrayBuffer | void> => {
  try {
    return (await axios(options)).data;
  } catch (err) {
    console.log(`
        Download ${options.url} was failed. 
        ${err}
      `);
  }
};

export const extractFile = async (
  data: ArrayBuffer,
  path: string
): Promise<void> => {
  try {
    const file = await ungzip(data);
    writeFileSync(path, file);
  } catch (err) {
    throw new Error(`${err}`);
  }
};
