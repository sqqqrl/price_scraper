import { Connection, createConnection } from 'mongoose';

require('dotenv').config();

export const conn = (): Connection => {
  console.log(`${process.env.MONGODB_URI}`);
  const conn = createConnection(`${process.env.MONGODB_URI}`);

  return conn;
};
