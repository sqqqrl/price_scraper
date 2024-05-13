import { AxiosError, AxiosResponse } from 'axios';
import { ProductDto } from '../../database/models/product_allo.model';

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

export type Pagination = {
  current_page: number;
  items_per_page: number;
  total_number_of_items: number;
};

export type ProductList = {
  existenceInRows: any;
  pagination: Pagination;
  products: ProductDto[];
};
