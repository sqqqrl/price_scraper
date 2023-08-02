import { readFileSync, readdirSync, existsSync } from 'fs';
import { parseString } from 'xml2js';

export const parseXmls = (xmlFolderPath: string): string[][] => {
  if (!existsSync(xmlFolderPath))
    throw new Error(`Folder "${xmlFolderPath}" is not exist.`);

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
