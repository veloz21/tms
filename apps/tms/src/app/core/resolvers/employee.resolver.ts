import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { EmployeeModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectEmployeeById } from '@tms/selectors/employee.selectors';
import { EmployeesService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class EmployeeResolver implements Resolve<EmployeeModel> {
  constructor(private employeesService: EmployeesService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<EmployeeModel> | Promise<EmployeeModel> | EmployeeModel {
    const id = String(route.paramMap.get('id'));
    if (!id) {
      return this.getInitialEmployee(id);
    }
    this.getEmployeeData(id);
    return this.waitForEmployeeDataToLoad(id);
  }

  getInitialEmployee(id: string) {
    return new EmployeeModel();
  }

  getEmployeeData(id: string) {
    this.store.select(selectEmployeeById(id)).pipe(
      take(1)
    ).subscribe(employeeStored => {
      if (!employeeStored) {
        return this.employeesService.getEmployeeById(id);
      }
    });
  }

  waitForEmployeeDataToLoad(id: string): Observable<EmployeeModel> {
    return this.store.select(selectEmployeeById(id)).pipe(
      filter(employee => !!employee),
      take(1)
    );
  }
}
