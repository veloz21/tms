import { classToClass, classToPlain, Exclude, Expose, Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { Types } from "mongoose";

export class BaseDBObject {

  @Expose({ name: 'id' })
  @Transform(value => value && value.toString())
  @IsOptional()
  _id: string;

  @Expose({ name: '_id', toPlainOnly: true })
  @Transform(value => value && new Types.ObjectId(value), { toClassOnly: true })
  @IsOptional()
  id: Types.ObjectId;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value), { toClassOnly: true })
  company: Types.ObjectId;

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