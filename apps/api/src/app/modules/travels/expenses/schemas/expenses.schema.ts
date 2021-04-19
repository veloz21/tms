import { IExpense } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../../admin/company';

export type ExpenseDocument = Expense & Document;

@Schema()
export class Expense implements IExpense {
  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: Number, default: null })
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
export const ExpenseSubdocumentSchema = SchemaFactory.createForClass(Expense);