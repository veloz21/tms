import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocumentsDocument = EmployeeDocuments & Document;

@Schema()
export class EmployeeDocuments {
  @Prop(raw({
    type: { type: String },
    dueDate: { type: Date },
    attachmentPath: { type: String }
  }))
  driversLicense: {
    type: string,
    dueDate: Date,
    attachmentPath: string,
  };

  @Prop(raw({
    date: { type: Date },
    expirationDate: { type: Date },
    attachmentPath: { type: String }
  }))
  psychophysicistTest: {
    date: Date,
    expirationDate: Date,
    attachmentPath: string,
  };

  @Prop(raw({
    attachmentPath: { type: [String] }
  }))
  ine: {
    attachmentPath: string[],
  };
}

export const EmployeeDocumentsSchema = SchemaFactory.createForClass(EmployeeDocuments);