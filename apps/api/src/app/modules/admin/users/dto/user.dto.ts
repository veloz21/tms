import { IUser } from '@bits404/api-interfaces';
import { Exclude, Expose } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';

@Exclude()
export class UserDto extends BaseDBObject implements IUser {

  @Expose()
  email: string;

  @Exclude({ toPlainOnly: true })
  password: string;

  @Expose()
  lastLogin: Date;

  @Expose()
  refreshToken: string;
}
