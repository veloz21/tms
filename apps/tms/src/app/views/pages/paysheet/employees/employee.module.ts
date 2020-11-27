// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./employees-list/employees-list.module').then(m => m.EmployeesListModule)
      },
      {
        path: 'add',
        loadChildren: () => import('./employee-edit/employee-edit.module').then(m => m.TruckEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./employee-edit/employee-edit.module').then(m => m.TruckEditModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./employee-edit/employee-edit.module').then(m => m.TruckEditModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  entryComponents: [],
  declarations: []
})
export class EmployeeModule { }
