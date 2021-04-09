import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EmployeeModel } from '@tms/models';
import { selectEmployeeById } from '@tms/selectors/employee.selectors';
import { Observable } from 'rxjs';
import { GetEmployee } from '../actions/employee.actions';
import { BaseResolver } from './base-resolver';

@Injectable()
export class EmployeeResolver extends BaseResolver<EmployeeModel> implements Resolve<EmployeeModel> {

  protected backRoute: string = '/paysheet/employees';
  protected getEmptyModel(): EmployeeModel {
    return new EmployeeModel();
  }

  protected getModelAction(id: string): GetEmployee {
    return new GetEmployee({ id });
  }

  protected selectModelFromStore(id: string): Observable<EmployeeModel> {
    return this.store.select(selectEmployeeById(id));
  }
}
