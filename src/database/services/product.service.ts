import { conn } from '../database-connection';
import {
  ProductDto,
  ProductModel,
  createProductModel,
} from '../models/product.model';

class ProductService {
  private productModel: ProductModel;
  constructor() {
    this.productModel = createProductModel(conn());
  }

  async existsByUrl(url: string): Promise<boolean> {
    try {
      const exist = await this.productModel.exists({ url });

      return Boolean(exist);
    } catch (e) {
      throw new Error('Failed to execute "exists" func: ' + e);
    }
  }

  // async findByName(productName: string): Promise<ObjectId> {
  //   try {
  //     const objId = await this.productModel.findOne({ name: productName });
  //     if (objId !== null) {
  //       return objId._id;
  //     }
  //     throw new Error(`ObjectId of ${productName} is null`);
  //   } catch (e) {
  //     throw new Error('Smth wrong with findByName: ' + e);
  //   }
  // }

  async save(data: ProductDto): Promise<void> {
    try {
      const exist = await this.existsByUrl(data.url);
      if (!exist) {
        await this.productModel.create({ ...data });
      }
    } catch (e) {
      throw new Error('Failed to create product: ' + e);
    }
  }
}
export const productService = new ProductService();
