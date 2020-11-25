import { IUser } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../company';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  lastLogin: Date;

  @Prop()
  refreshToken: string;

  @Prop()
  tenantId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: Company;

  comparePassword: (password: string) => boolean;
  hashPassword: () => void;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ company: 1, email: 1 }, { unique: true });

UserSchema.methods.comparePassword = function (candidatePassword: string): boolean {
  if (bcrypt.compareSync(candidatePassword, this.password)) return true;
  return false;
};

UserSchema.methods.hashPassword = function (): void {
  this.password = bcrypt.hashSync(this.password);
};

UserSchema.pre('save', function (next) {
  const user = this as UserDocument;
  if (user.password) {
    user.hashPassword();
  }
  next();
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
  }
});