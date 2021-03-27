// Angular
import { Pipe, PipeTransform } from '@angular/core';
import { TravelModel } from '../../../models';

@Pipe({
  name: 'b404CurrentStatus'
})
export class CurrentTravelStatusPipe implements PipeTransform {

  transform(travel: TravelModel) {
    if (!travel.status || !travel.currentStatus) {
      return;
    }
    return travel.status.find(s => s.id === travel.currentStatus);
  }
}
