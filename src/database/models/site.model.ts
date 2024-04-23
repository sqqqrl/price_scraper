import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

interface SiteDto {
  readonly name: string;
  readonly url: string;
}

interface Site extends Document {
  readonly name: string;
  readonly url: string;
}

type SiteModel = Model<Site>;

const siteSchema = new Schema<Site>({
  name: SchemaTypes.String,
  url: SchemaTypes.String,
});

const createSiteModel: (conn: Connection) => SiteModel = (conn: Connection) =>
  conn.model<Site>('site', siteSchema, 'sites');

export { Site, SiteDto, SiteModel, siteSchema, createSiteModel };
