import {
  Connection,
  Document,
  Model,
  ObjectId,
  Schema,
  SchemaTypes,
} from 'mongoose';

interface ArchivedLinkDto {
  readonly url: string;
  readonly site: ObjectId;
}

interface ArchivedLink extends Document {
  readonly url: string;
  readonly site: ObjectId;
}

type ArchivedLinkModel = Model<ArchivedLink>;

const ArchivedLinkSchema = new Schema<ArchivedLink>(
  {
    url: SchemaTypes.String,
    site: { type: SchemaTypes.ObjectId, ref: 'sites' },
  },
  {
    timestamps: true,
  }
);

const createArchivedLinkModel: (conn: Connection) => ArchivedLinkModel = (
  conn: Connection
) =>
  conn.model<ArchivedLink>(
    'archived-link',
    ArchivedLinkSchema,
    'archived-links'
  );

export {
  ArchivedLink,
  ArchivedLinkDto,
  ArchivedLinkModel,
  ArchivedLinkSchema,
  createArchivedLinkModel,
};
