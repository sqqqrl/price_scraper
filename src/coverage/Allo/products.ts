import { parseXmlByFilename } from '../../liba/parseXML';
import { SuiteProperties } from '../../liba/wrappers/suite';
import { processLinks } from './categories/liba';
import { CATEGORIES_FOLDER } from './constants';

//TODO: refactor. too dangerous
const filterDublicateCategories = (links: string[]): string[] => {
  const splitted = links.map((el) => el.split('/').filter((el) => el !== ''));
  const categories = splitted.reduce((prev, next) => {
    if (!prev.includes(next[next.length - 1])) {
      prev.push(next[next.length - 1]);
    }
    return prev;
  }, []);

  const main = categories.map((el) =>
    splitted
      .filter((arr) => arr.find((kek) => kek === el))
      .reduce((prev, next) => (prev.length > next.length ? next : prev))
  );

  return main.map((el) => el.join('/').replace(':', ':/'));
};

export const start = async ({ xmlFolder }: SuiteProperties): Promise<void> => {
  // the first sitemap (#1, mb #101, #201, #301, #401, #501, #601 and #701 ) consists of clear categories
  // without filter(like discount/brand etc..)
  // so it make sense scrap only them

  // TODO: some fixes after research more about them
  const mainSitemaps = [1, 101, 201, 301, 401, 501, 601, 701];

  const results: string[][] = [];
  for (const number of mainSitemaps) {
    const sitemap = parseXmlByFilename(
      xmlFolder + CATEGORIES_FOLDER,
      `sitemap${number}.xml`
    );

    results.push(filterDublicateCategories(sitemap));
  }

  await processLinks(results.flat());

  return;
};
