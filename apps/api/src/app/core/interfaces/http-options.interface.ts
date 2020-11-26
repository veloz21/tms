import * as mongoose from 'mongoose';
import { ClientSession } from 'mongoose';

export interface HttpOptions {
  session?: ClientSession;
  company?: mongoose.Types.ObjectId;
}