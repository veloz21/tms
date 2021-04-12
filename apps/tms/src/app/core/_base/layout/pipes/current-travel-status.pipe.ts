import { Pipe, PipeTransform } from '@angular/core';
import { TravelStatusModel } from '@tms/models';

@Pipe({
  name: 'b404CurrentStatus'
})
export class CurrentTravelStatusPipe implements PipeTransform {

  transform(status: Partial<TravelStatusModel>[], currentStatus?: string) {
    if (!status || !currentStatus) {
      return;
    }
    return status.find(s => s.id === currentStatus);
  }
}
