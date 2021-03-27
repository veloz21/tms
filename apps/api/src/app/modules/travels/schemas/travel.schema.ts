import { ITravel } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../admin/company';
import { CompanyConfig, CompanyConfigSchema } from '../../admin/company/schemas/company.config.schemas';
import { Employee, EmployeeSubdocumentSchema } from '../../admin/employees/schemas/employee.schema';
import { Box, BoxSubdocumentSchema } from '../../workshop/boxes';
import { Truck, TruckSubdocumentSchema } from '../../workshop/trucks';
import { TravelLocations, TravelLocationsSchema } from './travel-locations.schema';
import { TravelStatus, TravelStatusSubdocumentSchema } from './travel-status.schema';

export type TravelDocument = Travel & Document;

@Schema({ timestamps: true })
export class Travel implements ITravel {

  @Prop({ type: EmployeeSubdocumentSchema, default: {} })
  operator: Partial<Employee>;

  @Prop({ type: BoxSubdocumentSchema, default: {} })
  box: Partial<Box>;

  @Prop({ type: TruckSubdocumentSchema, default: {} })
  truck: Partial<Truck>;

  // GeoJson type
  @Prop({ type: TravelLocationsSchema, default: {} })
  locations: TravelLocations;

  @Prop({ type: [TravelStatusSubdocumentSchema], default: {} })
  status: Partial<TravelStatus>[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: TravelStatus.name })
  currentStatus: mongoose.Types.ObjectId | string;

  @Prop({ type: CompanyConfigSchema, default: {} })
  config: Partial<CompanyConfig>;

  @Prop()
  comments: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name, required: true })
  company: mongoose.Types.ObjectId;
}

export const TravelSchema = SchemaFactory.createForClass(Travel);

TravelSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
    delete el.company;
  }
});