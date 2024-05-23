import { ProductDto } from '../../../database/models/product_allo.model';

export type Pagination = {
  current_page: number;
  items_per_page: number;
  total_number_of_items: number;
};

export type ProductList = {
  existenceInRows: unknown;
  pagination: Pagination;
  products: ProductDto[];
};
