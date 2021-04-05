import * as mongoose from 'mongoose';

export function stringToMongoId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}