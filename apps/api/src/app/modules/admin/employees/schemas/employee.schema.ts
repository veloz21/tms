import { IEmployee } from '@bits404/api-interfaces';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../company';
import { User } from '../../users/schemas/user.schema';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee extends User implements IEmployee {

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  cellphone: string;

  @Prop()
  address: string;

  @Prop()
  secondaryCellphone: string;

  @Prop(raw({
    currency: { type: String },
    total: { type: Number }
  }))
  salary: {
    currency: string,
    total: number,
  };

  @Prop(
    raw({
      driversLicense: {
        type: String,
        dueDate: Date,
        attachmentPath: String,
      },
      phychophysicistTest: {
        date: Date,
        expirationDate: Date,
        attachmentPath: String,
      },
      ine: {
        attachmentPath: [String],
      },
    })
  )
  documents: {
    driversLicense: {
      type: string,
      dueDate: Date,
      attachmentPath: string,
    },
    phychophysicistTest: {
      date: Date,
      expirationDate: Date,
      attachmentPath: string,
    },
    ine: {
      attachmentPath: string[],
    },
  };

  @Prop()
  imagePath: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.index({ company: 1, firstName: 1, lastName: 1 }, { unique: true });

EmployeeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
    delete el.company;
  }
});