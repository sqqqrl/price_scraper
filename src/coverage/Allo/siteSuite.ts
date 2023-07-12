import { Suite } from '../../liba/wrappers/suite';
import { downloadSitemaps, getArchiveLinksFromSitemap } from './action';

const suite = new Suite({
  url: 'https://allo.ua/',
  sitemapUrl: 'https://allo.ua/sitemap.xml',
}).actions([downloadSitemaps(getArchiveLinksFromSitemap)]);

export default {
  suite,
};
