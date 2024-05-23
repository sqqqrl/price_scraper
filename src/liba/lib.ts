import { writeFileSync, mkdirSync } from 'fs';
import { CheckerFunc } from '../types/TypeChecker';
import axios, { AxiosRequestConfig } from 'axios';
import { dirname } from 'path';
import { isArrayBuffer } from '../utils';

export const typeChecker = (
  f: CheckerFunc,
  data: unknown,
  err: string
): any => {
  const check = f(data);
  if (check) {
    return data;
  }

  throw new Error(err);
};

export const downloadAndExtactArchive = async (
  url: string,
  path: string
): Promise<void> =>
  await writeFile(
    typeChecker(
      isArrayBuffer,
      await downloadFile({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
      }),
      'Wrong downloaded data'
    ),
    path
  );

const downloadFile = async (
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

const writeFile = async (
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
