import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaysheetComponent } from './paysheet.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'employees',
        loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  entryComponents: [],
  declarations: [PaysheetComponent]
})
export class PaysheetModule { }
