import { classToClass, classToPlain, Exclude, Expose, Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import * as mongoose from 'mongoose';

export class BaseDBObject {
  // this will expose the _id field as a string
  // and will change the attribute name to `id`
  @Expose({ name: 'id' })
  @Transform(value => value && value.toString())
  @IsOptional()
  // tslint:disable-next-line: variable-name
  _id: any;

  @Exclude()
  @IsOptional()
  // @Transform(({ value }) => new mongoose.Types.ObjectId(value), { toClassOnly: true })
  company: mongoose.Types.ObjectId;

  toJSON() {
    return classToPlain(this);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toObject() {
    return classToClass(this, { ignoreDecorators: true });
  }
}