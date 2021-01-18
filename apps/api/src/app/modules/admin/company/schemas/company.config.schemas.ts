import { ICompany } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyCongifDocument = CompanyConfig & Document;

@Schema()
export class CompanyConfig implements ICompany {

  @Prop()
  name: string;

  @Prop()
  currency: string;
  
  @Prop()
  distanceUniti: string;
}

export const CompanyConfigSchema = SchemaFactory.createForClass(CompanyConfig);

CompanyConfigSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
  }
});