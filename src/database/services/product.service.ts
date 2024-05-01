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
  findAll(urls: string[]): Promise<ProductDto[]> {
    try {
      return this.productModel.find().where('url').in(urls).lean().exec();
    } catch (e) {
      throw new Error('Failed to findAll available link: ' + e);
    }
  }

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

  async saveAll(data: ProductDto[]): Promise<void> {
    try {
      await this.productModel.bulkWrite(
        data.map((product) => ({
          updateOne: {
            filter: { id: product.id },
            update: { $set: product },
            upsert: true,
          },
        }))
      );
    } catch (e) {
      throw new Error('Failed to create products: ' + e);
    }
  }
}
export const productService = new ProductService();
