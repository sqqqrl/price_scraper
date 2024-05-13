import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

interface ProductDto {
  readonly id: number;
  readonly name: string;
  readonly price: {
    price: number;
    old_price?: number;
  };
  readonly rating: {
    best_rating: number;
    count: number;
    value: number;
  };
  readonly url: string;
}

interface Product extends Document {
  readonly id: number;
  readonly name: string;
  readonly price: {
    price: number;
    old_price?: number;
  };
  readonly rating: {
    best_rating: number;
    count: number;
    value: number;
  };
  readonly url: string;
}

type ProductModel = Model<Product>;

const ProductSchema = new Schema<Product>(
  {
    id: SchemaTypes.String,
    name: SchemaTypes.String,
    price: {
      price: SchemaTypes.String,
      old_price: {
        type: String,
        required: false,
      },
    },
    rating: {
      best_rating: SchemaTypes.Number,
      count: SchemaTypes.Number,
      value: SchemaTypes.Number,
    },
    url: SchemaTypes.String,
  },
  {
    timestamps: true,
  }
);

const createProductModel: (conn: Connection) => ProductModel = (
  conn: Connection
) => conn.model<Product>('product_allo', ProductSchema, 'products_allo');

export { Product, ProductDto, ProductModel, ProductSchema, createProductModel };
