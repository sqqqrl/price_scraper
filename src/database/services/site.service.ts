import { ObjectId } from 'mongoose';
import { conn } from '../database-connection';
import { SiteDto, SiteModel, createSiteModel } from '../models/site.model';

class SiteService {
  private siteModel: SiteModel;
  constructor() {
    this.siteModel = createSiteModel(conn());
  }

  async existsByName(siteName: string): Promise<boolean> {
    try {
      const exist = await this.siteModel.exists({ name: siteName });

      return Boolean(exist);
    } catch (e) {
      throw new Error('Site not exists by this name: ' + e);
    }
  }

  async findByName(siteName: string): Promise<ObjectId> {
    try {
      const objId = await this.siteModel.findOne({ name: siteName });
      if (objId !== null) {
        return objId._id;
      }
      throw new Error(`ObjectId of ${siteName} is null`);
    } catch (e) {
      throw new Error('Smth wrong with findByName: ' + e);
    }
  }

  async save(data: SiteDto): Promise<void> {
    try {
      await this.siteModel.create({ ...data });
    } catch (e) {
      throw new Error('Failed to create site: ' + e);
    }
  }
}
export const siteService = new SiteService();
