import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Employee } from '@tms/interfaces';
import { EmployeeModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectEmployeeById } from '@tms/selectors/employee.selectors';
import { EmployeesService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class EmployeeResolver implements Resolve<Employee> {
  constructor(private employeesService: EmployeesService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<Employee> | Promise<Employee> | Employee {
    const id = Number(route.paramMap.get('id'));
    if (id === 0) {
      return this.getInitialEmployee(id);
    }
    this.getEmployeeData(id);
    return this.waitForEmployeeDataToLoad(id);
  }

  getInitialEmployee(id: number) {
    return new EmployeeModel();
  }
  getEmployeeData(id: number) {
    this.store.select(selectEmployeeById(id)).pipe(
      take(1)
    ).subscribe(employeeStored => {
      if (!employeeStored) {
        return this.employeesService.getEmployeeById(id);
      }
    });
  }

  waitForEmployeeDataToLoad(id: number): Observable<Employee> {
    return this.store.select(selectEmployeeById(id)).pipe(
      filter(employee => !!employee),
      take(1)
    );
  }
}
