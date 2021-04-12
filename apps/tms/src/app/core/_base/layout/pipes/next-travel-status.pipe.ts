import { Pipe, PipeTransform } from '@angular/core';
import { TravelStatusModel } from '@tms/models';

@Pipe({
  name: 'b404NextStatus'
})
export class NextTravelStatusPipe implements PipeTransform {

  transform(status: Partial<TravelStatusModel>[], currentStatus?: string) {
    if (!status || !currentStatus) {
      return;
    }

    const index = status.findIndex(s => s.id === currentStatus);
    return status[index + 1] || null;
  }
}
