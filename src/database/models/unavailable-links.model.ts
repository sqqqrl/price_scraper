import {
  Connection,
  Document,
  Model,
  ObjectId,
  Schema,
  SchemaTypes,
} from 'mongoose';

interface UnavailableLink extends Document {
  readonly url: string;
  readonly site: ObjectId;
}

interface UnavailableLinkDto {
  readonly url: string;
  readonly site: ObjectId;
}

type UnavailableLinkModel = Model<UnavailableLink>;

const UnavailableLinkSchema = new Schema<UnavailableLink>(
  {
    url: SchemaTypes.String,
    site: { type: SchemaTypes.ObjectId, ref: 'sites' },
  },
  {
    timestamps: true,
  }
);

const createUnavailableLinkModel: (conn: Connection) => UnavailableLinkModel = (
  conn: Connection
) =>
  conn.model<UnavailableLink>(
    'unavailable-link',
    UnavailableLinkSchema,
    'unavailable-links'
  );

export {
  UnavailableLink,
  UnavailableLinkDto,
  UnavailableLinkModel,
  UnavailableLinkSchema,
  createUnavailableLinkModel,
};
