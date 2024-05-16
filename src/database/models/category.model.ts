import {
  Connection,
  Document,
  Model,
  ObjectId,
  Schema,
  SchemaTypes,
} from 'mongoose';

interface Category extends Document {
  readonly url: string;
  readonly site: ObjectId;
  readonly supplementable: boolean;
}

interface CategoryDto {
  readonly url: string;
  readonly site: ObjectId;
  readonly supplementable: boolean;
}

type CategoryModel = Model<Category>;

const CategorySchema = new Schema<Category>(
  {
    url: SchemaTypes.String,
    site: { type: SchemaTypes.ObjectId, ref: 'sites' },
    supplementable: SchemaTypes.Boolean,
  },
  {
    timestamps: true,
  }
);

const createCategoryModel: (conn: Connection) => CategoryModel = (
  conn: Connection
) => conn.model<Category>('category', CategorySchema, 'categories');

export {
  Category,
  CategoryDto,
  CategoryModel,
  CategorySchema,
  createCategoryModel,
};
