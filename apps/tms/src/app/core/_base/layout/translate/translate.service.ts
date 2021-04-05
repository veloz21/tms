import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateService extends TranslateService {
  instant(key: string, params?: Object) {
    let gender: string;
    let interpolateParams: Object = {};

    if (params) {
      for (const [key, content] of Object.entries(params)) {
        let paramValue: string;

        if (typeof content === 'object' && content.GENDER) {
          gender = content.GENDER;
          paramValue = content.VALUE;
        } else {
          paramValue = content as string;
        }
        interpolateParams[key] = paramValue;
      }
    }

    return super.instant((gender ? `${key}.${gender}` : key), interpolateParams);
  }
}