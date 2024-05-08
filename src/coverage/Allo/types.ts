import { AxiosError, AxiosResponse } from 'axios';

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

export type SitemapScrapper = (
  sitemapUrl: string,
  sitemapType: string
) => Promise<string[] | null>;

export type AxiosResult = Promise<AxiosResponse | AxiosError>;
export type GetProductPage = (link: string) => AxiosResult;
