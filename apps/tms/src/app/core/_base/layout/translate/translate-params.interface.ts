import { TranslateGender } from './translate-genders.enum';

export interface TranslateParams {
  entity: {
    gender: TranslateGender,
    value: string,
  },
  entities: {
    gender: TranslateGender,
    value: string,
  },
}