import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

interface TestDto {
  readonly name: string;
  readonly url: string;
}

interface Test extends Document {
  readonly name: string;
  readonly url: string;
}

type TestModel = Model<Test>;

const testSchema = new Schema<Test>({
  name: SchemaTypes.String,
  url: SchemaTypes.String,
});

const createTestModel: (conn: Connection) => TestModel = (conn: Connection) =>
  conn.model<Test>('test', testSchema, 'tests');

export { Test, TestDto, TestModel, testSchema, createTestModel };
