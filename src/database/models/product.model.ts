import {
  Connection,
  Document,
  Model,
  ObjectId,
  Schema,
  SchemaTypes,
} from 'mongoose';

interface ProductDto {
  readonly id: string;
  readonly brand: string;
  readonly category: string;
  readonly name: string;
  readonly price: string;
  readonly site: ObjectId;
  readonly url: string;
}

interface Product extends Document {
  readonly id: string;
  readonly brand: string;
  readonly category: string;
  readonly name: string;
  readonly price: string;
  readonly site: ObjectId;
  readonly url: string;
}

type ProductModel = Model<Product>;

const ProductSchema = new Schema<Product>(
  {
    id: SchemaTypes.String,
    brand: SchemaTypes.String,
    category: SchemaTypes.String,
    name: SchemaTypes.String,
    price: SchemaTypes.String,
  },
  {
    timestamps: true,
  }
);

const createProductModel: (conn: Connection) => ProductModel = (
  conn: Connection
) => conn.model<Product>('product', ProductSchema, 'products');

export { Product, ProductDto, ProductModel, ProductSchema, createProductModel };
