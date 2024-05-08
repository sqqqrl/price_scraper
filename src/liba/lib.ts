import { writeFileSync, mkdirSync } from 'fs';
import { CheckerFunc } from '../types/TypeChecker';
import axios, { AxiosRequestConfig } from 'axios';
import { dirname } from 'path';

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

export const writeFile = async (
  data: ArrayBuffer,
  filePath: string
): Promise<void> => {
  try {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, data.toString());
  } catch (err) {
    throw new Error(`${err}`);
  }
};
