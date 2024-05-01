import { conn } from '../database-connection';
import { TestDto, TestModel, createTestModel } from '../models/test.model';

class TestService {
  private testModel: TestModel;
  constructor() {
    this.testModel = createTestModel(conn());
  }

  saveAll(data: TestDto[]): Promise<any> {
    try {
      return this.testModel.bulkWrite(
        data.map((el) => ({
          updateOne: {
            filter: { name: el.name },
            update: { $set: el },
            upsert: true,
          },
        }))
      );
    } catch (e) {
      throw new Error('Failed to create test: ' + e);
    }
  }

  findAll(urls: string[]): Promise<TestDto[]> {
    try {
      return this.testModel.find().where('url').in(urls).exec();
    } catch (e) {
      throw new Error('Failed to create test: ' + e);
    }
  }
}
export const testService = new TestService();
