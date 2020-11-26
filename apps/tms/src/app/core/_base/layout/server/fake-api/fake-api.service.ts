import { Injectable } from '@angular/core';
import { BoxTable } from '@tms/server/box.table';
import { EmployeeTable } from '@tms/server/employees.table';
import { TireTable } from '@tms/server/tire.table';
import { TravelDataContext } from '@tms/server/travel.data-context';
import { WorkshopDataContext } from '@tms/server/workshop.data-context';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { AuthDataContext } from '../../../../auth';

@Injectable()
export class FakeApiService implements InMemoryDbService {

  constructor() { }

  /**
   * Create Fake DB and API
   */
  createDb(): {} | Observable<{}> {
    // tslint:disable-next-line:class-name
    const db = {
      // auth module
      users: AuthDataContext.users,
      roles: AuthDataContext.roles,
      permissions: AuthDataContext.permissions,
      employees: EmployeeTable.employees,
      trucks: WorkshopDataContext.trucks,
      maintenances: WorkshopDataContext.maintenances,
      travels: TravelDataContext.travels,
      boxes: BoxTable.boxes,
      tires: TireTable.tires,
    };
    return db;
  }
}
