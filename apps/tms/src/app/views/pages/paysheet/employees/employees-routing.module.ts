import { CommonModule } from '@angular/common';
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
        loadChildren: () => import('./employees-edit/employees-edit.module').then(m => m.EmployeesEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./employees-edit/employees-edit.module').then(m => m.EmployeesEditModule),
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }