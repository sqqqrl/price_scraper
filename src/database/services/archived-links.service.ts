import {
  ArchivedLinkDto,
  ArchivedLinkModel,
  createArchivedLinkModel,
} from '../models/archived-links.model';
import { conn } from '../database-connection';

class ArchivedLinkService {
  private archivedLinkModel: ArchivedLinkModel;
  constructor() {
    this.archivedLinkModel = createArchivedLinkModel(conn());
  }

  async existsByLink(link: string): Promise<boolean> {
    try {
      const exist = await this.archivedLinkModel.exists({ url: link });

      return Boolean(exist);
    } catch (e) {
      throw new Error('existsByLink: ' + e);
    }
  }

  async save(data: ArchivedLinkDto): Promise<void> {
    try {
      await this.archivedLinkModel.create({ ...data });
    } catch (e) {
      throw new Error('Failed to create archived link: ' + e);
    }
  }

  async saveAll(data: ArchivedLinkDto[]): Promise<ArchivedLinkDto[]> {
    try {
      return this.archivedLinkModel.insertMany(data);
    } catch (e) {
      throw new Error('Failed to create archived links: ' + e);
    }
  }

  findAll(urls: string[]): Promise<ArchivedLinkDto[]> {
    try {
      return this.archivedLinkModel.find().where('url').in(urls).lean().exec();
    } catch (e) {
      throw new Error('Failed to findAll archived link: ' + e);
    }
  }
}
export const archivedLinkService = new ArchivedLinkService();
