import {
  UnavailableLinkDto,
  UnavailableLinkModel,
  createUnavailableLinkModel,
} from '../models/unavailable-links.model';
import { conn } from '../database-connection';

class UnavailableLinkService {
  private unavailableLinkModel: UnavailableLinkModel;
  constructor() {
    this.unavailableLinkModel = createUnavailableLinkModel(conn());
  }

  async existsByLink(link: string): Promise<boolean> {
    try {
      const exist = await this.unavailableLinkModel.exists({ url: link });

      return Boolean(exist);
    } catch (e) {
      throw new Error('existsByLink: ' + e);
    }
  }

  async save(data: UnavailableLinkDto): Promise<void> {
    try {
      await this.unavailableLinkModel.create({ ...data });
    } catch (e) {
      throw new Error('Failed to create archived link: ' + e);
    }
  }
}

export const unavailableLinkService = new UnavailableLinkService();
