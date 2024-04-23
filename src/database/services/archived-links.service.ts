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
}
export const archivedLinkService = new ArchivedLinkService();
