import { IQueryParams, IQueryResults, ITravelStatus } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../core/interfaces';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TravelStatus, TravelStatusDocument } from './schemas/travel-status.schema';
import { Travel, TravelDocument } from './schemas/travel.schema';

@Injectable()
export class TravelsService {

  constructor(
    @InjectModel(Travel.name) private readonly travelModel: Model<TravelDocument>,
    @InjectModel(TravelStatus.name) private readonly travelStatusModel: Model<TravelStatusDocument>,
  ) { }

  create(createTravelDto: CreateTravelDto, options: HttpOptions): Promise<TravelDocument> {
    const travelModel = new this.travelModel(createTravelDto);
    travelModel.company = options.company;
    return travelModel.save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.travelModel.find({ company: options.company }).session(options.session);
    const query = this.travelModel.find().merge(baseQuery).sort({ [queryParams.sortField]: queryParams.sortOrder }).limit(limit).skip(skip);
    const countQuery = this.travelModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
  }

  findOne(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: mongoose.Types.ObjectId, updateTravelDto: UpdateTravelDto, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTravelDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }

  updateCurrentStatus(_id: mongoose.Types.ObjectId, statusId: mongoose.Types.ObjectId, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOneAndUpdate({ _id, company: options.company }, { $set: { "currentStatus": statusId } }, { new: true, session: options.session }).exec();
  }

  getTravelStatus(options: HttpOptions) {
    return this.travelStatusModel.find({ company: options.company }).sort('order').select('name').session(options.session);
  }

  createDefaultTravelStatus(options: HttpOptions) {
    const defaultStatus: ITravelStatus[] = [
      {
        order: 0,
        name: 'Programado',
        date: new Date(),
        comments: '',
      },
      {
        order: 1,
        name: 'Salida de Patio',
        date: new Date(),
        comments: '',
      },
      {
        order: 2,
        name: 'Llegada a Cargar',
        date: new Date(),
        comments: '',
      },
      {
        order: 3,
        name: 'Cargado',
        date: new Date(),
        comments: '',
      },
      {
        order: 4,
        name: 'Llegada a Destino',
        date: new Date(),
        comments: '',
      },
      {
        order: 5,
        name: 'Inicio de descarga',
        date: new Date(),
        comments: '',
      },
      {
        order: 6,
        name: 'Descargado',
        date: new Date(),
        comments: '',
      },
      {
        order: 7,
        name: 'Salida de Destino',
        date: new Date(),
        comments: '',
      },
      {
        order: 8,
        name: 'Llegada a Patio',
        date: new Date(),
        comments: '',
      },
    ];
    const status = defaultStatus.map(s => ({ ...s, company: options.company }));
    console.log('status', status);
    return this.travelStatusModel.insertMany(status, { session: options.session });
  }
}
