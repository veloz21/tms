import { IExpense } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../../admin/company';

export type ExpensesDocument = Expenses & Document;

@Schema()
export class Expenses implements IExpense {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const ExpensesSchema = SchemaFactory.createForClass(Expenses);

ExpensesSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
    delete el.company;
  },
});
