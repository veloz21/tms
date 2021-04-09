import { ITravelStatus, Status } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpOptions } from '../../core/interfaces';
import { TravelStatus, TravelStatusDocument } from '../travels/schemas/travel-status.schema';

@Injectable()
export class AuthRegisterService {

  constructor(
    @InjectModel(TravelStatus.name) private readonly travelStatusModel: Model<TravelStatusDocument>,
  ) { }

  async createDefaultTravelStatus(options: HttpOptions) {

    const defaultStatus: ITravelStatus[] = [
      {
        name: 'Programado',
        date: new Date(),
        comments: '',
      },
      {
        name: 'Salida de Patio',
        date: new Date(),
        comments: '',
        relatedStatus: {
          box: Status.NOT_AVAILABLE,
          truck: Status.NOT_AVAILABLE,
          employee: Status.NOT_AVAILABLE,
        }
      },
      {
        name: 'Llegada a Cargar',
        date: new Date(),
        comments: '',
      },
      {
        name: 'Cargado',
        date: new Date(),
        comments: '',
      },
      {
        name: 'Llegada a Destino',
        date: new Date(),
        comments: '',
      },
      {
        name: 'Inicio de descarga',
        date: new Date(),
        comments: '',
      },
      {
        name: 'Descargado',
        date: new Date(),
        comments: '',
      },
      {
        name: 'Salida de Destino',
        date: new Date(),
        comments: '',
      },
      {
        name: 'Llegada a Patio',
        date: new Date(),
        comments: '',
        relatedStatus: {
          box: Status.AVAILABLE,
          truck: Status.AVAILABLE,
          employee: Status.AVAILABLE,
        }
      },
    ];
    const status = defaultStatus.map(s => ({ ...s, company: options.company }));
    console.log('travelStatusModel status', status);
    return this.travelStatusModel.insertMany(status, { session: options.session, ordered: true });
  }
}
