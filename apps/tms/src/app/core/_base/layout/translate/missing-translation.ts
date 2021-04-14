import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { TranslateGender } from './translate-genders.enum';

export class MissingTranslationHelper implements MissingTranslationHandler {

  handle(params: MissingTranslationHandlerParams) {

    // if the key with gender doesn't exist
    let key = params.key;
    Object.values(TranslateGender).map(gender => {
      key = key.replace(`.${gender}`, '');
    });

    if (params.key == key) {
      console.log('Missing', key);
    }

    return params.key == key ? params.key : params.translateService.instant(key, params.interpolateParams);
  }
}