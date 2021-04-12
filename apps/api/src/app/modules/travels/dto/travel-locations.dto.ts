import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
class TravelLocationDto {

  @Expose()
  type: 'Point';

  @Expose()
  coordinates: number[];
}

@Exclude()
export class TravelLocationsDto {

  @Expose()
  @Type(() => TravelLocationDto)
  origin: TravelLocationDto;

  @Expose()
  @Type(() => TravelLocationDto)
  destination: TravelLocationDto;
}
