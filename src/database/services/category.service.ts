import { conn } from '../database-connection';
import {
  CategoryModel,
  createCategoryModel,
  CategoryDto,
} from '../models/category.model';

class CategoryService {
  private CategoryModel: CategoryModel;
  constructor() {
    this.CategoryModel = createCategoryModel(conn());
  }

  async existsByLink(link: string): Promise<boolean> {
    try {
      const exist = await this.CategoryModel.exists({ url: link });

      return Boolean(exist);
    } catch (e) {
      throw new Error('existsByLink: ' + e);
    }
  }

  async save(data: CategoryDto): Promise<void> {
    try {
      await this.CategoryModel.create({ ...data });
    } catch (e) {
      throw new Error('Failed to create unavailable link: ' + e);
    }
  }

  async saveAll(data: CategoryDto[]): Promise<CategoryDto[]> {
    try {
      return this.CategoryModel.insertMany(data);
    } catch (e) {
      throw new Error('Failed to create unavailable links: ' + e);
    }
  }

  findAll(urls: string[]): Promise<CategoryDto[]> {
    try {
      return this.CategoryModel.find().where('url').in(urls).lean().exec();
    } catch (e) {
      throw new Error('Failed to findAll unavailable link: ' + e);
    }
  }
}

export const categoryService = new CategoryService();
