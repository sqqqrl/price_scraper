import { readFileSync, readdirSync } from 'fs';
import { parseString } from 'xml2js';
import { xmlFolderPath } from '../config';

export const parseXmls = (): string[][] => {
  const files = readdirSync(xmlFolderPath).map(fileName =>
    readFileSync(`${xmlFolderPath}/${fileName}`, 'utf-8')
  );

  const urls: string[][] = [];

  for (const file of files) {
    parseString(file, (err, res) => {
      if (err) throw new Error(`${err}`);
      return urls.push(res.urlset.url.map(el => el?.loc.shift()));
    });
  }

  return urls;
};
