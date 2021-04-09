import { ITravelStatus } from '@bits404/api-interfaces';

export class TravelStatusModel implements ITravelStatus {

  id: string | null = null;
  date: Date | null = null;
  name: string = '';
  comments: string = '';

  constructor(travelStatus?: Partial<ITravelStatus>) {
    this.id = (travelStatus && travelStatus.id) || null;
    this.date = (travelStatus && travelStatus.date) || null;
    this.name = (travelStatus && travelStatus.name) || '';
    this.comments = (travelStatus && travelStatus.comments) || '';
  }
}
