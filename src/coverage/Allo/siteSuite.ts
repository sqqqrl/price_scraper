import { xmlFolderPath } from '../../config';
import { Suite } from '../../liba/wrappers/suite';
import {
  // downloadSitemaps,
  // getArchiveLinksFromSitemap,
  collectProductLinks,
} from './action';

const suite = new Suite({
  url: 'https://allo.ua/',
  sitemapUrl: 'https://allo.ua/sitemap.xml',
  xmlFolder: xmlFolderPath + 'allo/',
}).actions([
  // downloadSitemaps(getArchiveLinksFromSitemap),
  collectProductLinks,
]);

export default {
  suite,
};
