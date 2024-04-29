import { SuiteProperties } from '../../liba/wrappers/suite';

export type Product = {
  brand: string;
  category: string;
  id: string;
  name: string;
  price: string;
};

export type ProductJSON = {
  categoryId: string;
  ecommerce: {
    detail: {
      actionField: {
        action: string;
        list: string;
      };
      products: Product[];
    };
  };
  productAvailability: string;
  productGroupName: string;
};

export type ProductParseResult = {
  url: string;
  product: ProductJSON;
};

export type ScrapArhivesWithProductLinks = (
  sitemapUrl: SuiteProperties
) => Promise<string[]>;
