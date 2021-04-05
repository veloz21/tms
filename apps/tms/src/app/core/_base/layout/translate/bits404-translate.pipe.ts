import { Pipe, PipeTransform } from "@angular/core";
import { CustomTranslateService } from "./translate.service";

@Pipe({
  name: 'b404Translate'
})
export class Bits404TranslatePipe implements PipeTransform {
  constructor(
    private customTranslateService: CustomTranslateService,
  ) { }

  transform(value: string, args?: Object) {
    return this.customTranslateService.instant(value, args);
  }
}