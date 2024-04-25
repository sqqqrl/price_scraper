import { readFileSync, readdirSync, existsSync } from 'fs';
import { parseString } from 'xml2js';

export const parseXmls = (xmlFolderPath: string): string[][] => {
  if (!existsSync(xmlFolderPath))
    throw new Error(`Folder "${xmlFolderPath}" is not exist.`);

  const files = readdirSync(xmlFolderPath).map(fileName =>
    readFileSync(`${xmlFolderPath}/${fileName}`, 'utf-8')
  );

  try {
    const urls: string[][] = [];

    for (const file of files) {
      parseString(file, (err, res) => {
        if (err) throw new Error(`${err}`);
        return urls.push(res.urlset.url.map(el => el?.loc.shift()));
      });
    }

    return urls;
  } catch (e) {
    throw new Error(`parseXmls: ${e}`);
  }
};

//parse xml by filename for debugging
export const parseXmlByFilename = (
  xmlFolderPath: string,
  fileName: string
): string[] => {
  if (!existsSync(xmlFolderPath))
    throw new Error(`Folder "${xmlFolderPath}" is not exist.`);

  try {
    const file = readFileSync(`${xmlFolderPath}/${fileName}`, 'utf-8');
    let urls: string[] = [];
    parseString(file, (err, res) => {
      if (err) throw new Error(`${err}`);
      urls = res.urlset.url.map(el => el?.loc.shift());
      return;
    });

    return urls;
  } catch (e) {
    throw new Error(`parseXmls: ${e}`);
  }
};
