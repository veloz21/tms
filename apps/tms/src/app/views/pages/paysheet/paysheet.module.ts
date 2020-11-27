import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaysheetComponent } from './paysheet.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'employees',
        loadChildren: () => import('./employees/employee.module').then(m => m.EmployeeModule),
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
