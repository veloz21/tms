import { ITravel } from '@bits404/api-interfaces';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../admin/company';
import { CompanyConfig, CompanyConfigSchema } from '../../admin/company/schemas/company.config.schemas';
import { Employee, EmployeeSchema } from '../../admin/employees';
import { Box, BoxSchema } from '../../workshop/boxes';
import { Truck, TruckSchema } from '../../workshop/trucks';
import { TravelLocations, TravelLocationsSchema } from './travel-locations.schema';

export type TravelDocument = Travel & Document;

@Schema()
export class Travel implements ITravel {
  @Prop({ type: EmployeeSchema, default: {} })
  operator: Partial<Employee>;

  @Prop({ type: BoxSchema, default: {} })
  box: Partial<Box>;

  @Prop({ type: TruckSchema, default: {} })
  truck: Partial<Truck>;

  @Prop()
  date: Date;

  @Prop()
  salePrice: number;

  @Prop()
  expenses: number;

  // GeoJson type
  @Prop({ type: TravelLocationsSchema, default: {} })
  locations: TravelLocations;

  @Prop(
    raw({
      loading: Date,
      unloading: Date,
      originArrive: Date,
      destinationArrive: Date,
    })
  )
  times: {
    loading: Date;
    unloading: Date;
    originArrive: Date;
    destinationArrive: Date;
  };

  @Prop({ type: CompanyConfigSchema, default: {} })
  config: Partial<CompanyConfig>;

  @Prop()
  comments: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
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
  },
});
