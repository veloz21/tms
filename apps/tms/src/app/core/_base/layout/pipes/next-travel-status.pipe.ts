// Angular
import { Pipe, PipeTransform } from '@angular/core';
import { TravelModel } from '../../../models';

@Pipe({
  name: 'b404NextStatus'
})
export class NextTravelStatusPipe implements PipeTransform {

  transform(travel: TravelModel) {
    if (!travel.status || !travel.currentStatus) {
      return;
    }
    const index = travel.status.findIndex(s => s.id == travel.currentStatus);
    return travel.status[index + 1] || null;
  }
}
