import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';

@Exclude()
class DriversLicenseDto {
  @Expose()
  type: string;
  @Expose()
  dueDate: Date;
  @Expose()
  attachmentPath: string;
}

@Exclude()
class PsychophysicistTestDto {
  @Expose()
  date: Date;

  @Expose()
  expirationDate: Date;

  @Expose()
  attachmentPath: string;
}

@Exclude()
class IneDto {
  @Expose()
  attachmentPath: string[];
}

@Exclude()
export class EmployeeDocumentsDto extends BaseDBObject {

  @Expose()
  @Type(() => DriversLicenseDto)
  driversLicense: DriversLicenseDto;

  @Expose()
  @Type(() => DriversLicenseDto)
  psychophysicistTest: PsychophysicistTestDto;

  @Expose()
  @Type(() => IneDto)
  ine: IneDto;
}