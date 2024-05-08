import { xmlFolderPath } from '../../config';
import { Suite } from '../../liba/wrappers/suite';
import { initSiteCollection } from './actions';

const suite = new Suite({
  siteName: 'Allo',
  url: 'https://allo.ua/',
  sitemapUrl: 'https://allo.ua/sitemap.xml',
  xmlFolder: xmlFolderPath + 'allo/',
}).actions([
  initSiteCollection,
  // downloadSitemaps(sitemapScrapper, 'categories'),
  // start,
]);

export default {
  suite,
};
