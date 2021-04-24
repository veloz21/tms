import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'b404Date'
})
export class Bits404DatePipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const defaultFormat = 'short';
    return super.transform(value, args || defaultFormat);
  }
}