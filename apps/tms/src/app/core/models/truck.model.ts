import { ITire, ITruck } from '@bits404/api-interfaces';

export class TruckModel implements ITruck {
  id: string;
  truckModel: string;
  nickname: string;
  brand: string;
  serialNumber: string;
  motorNumber: string;
  maintenancePeriod: string;
  initialRange: number;
  rangeTraveled: number;
  price: number;
  circulationCard: string;
  airbag: string;
  dock: string;
  status: number;
  imagePath: string;
  tires: Partial<ITire>[];

  constructor(truck?: Partial<ITruck>) {
    this.truckModel = truck && truck.truckModel || '';
    this.nickname = truck && truck.nickname || ''
    this.brand = truck && truck.brand || '';
    this.serialNumber = truck && truck.serialNumber || '';
    this.motorNumber = truck && truck.motorNumber || '';
    this.maintenancePeriod = truck && truck.maintenancePeriod || '';
    this.initialRange = truck && truck.initialRange || null;
    this.rangeTraveled = truck && truck.rangeTraveled || null;
    this.price = truck && truck.price || null;
    this.circulationCard = truck && truck.circulationCard || '';
    this.airbag = truck && truck.airbag || '';
    this.dock = truck && truck.dock || '';
    this.status = truck && truck.status;
    this.imagePath = truck && truck.imagePath || '';
    this.tires = truck && truck.tires || [];
  }
}
