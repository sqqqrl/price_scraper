import { xmlFolderPath } from '../../config';
import { Suite } from '../../liba/wrappers/suite';
import { initSiteCollection, start } from './actions';

const suite = new Suite({
  siteName: 'Allo',
  url: 'https://allo.ua/',
  sitemapUrl: 'https://allo.ua/sitemap.xml',
  xmlFolder: xmlFolderPath + 'allo/',
}).actions([
  initSiteCollection,
  // downloadSitemaps(scrapArhivesWithProductLinks),
  start,
]);

export default {
  suite,
};
