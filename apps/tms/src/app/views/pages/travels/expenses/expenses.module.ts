import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ExpenseEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { PartialsModule } from '@tms/partials/partials.module';
import { expensesReducer } from '@tms/reducers';
import { ExpensesService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ExpenseModule } from './expense/expense.module';
import { ExpensesComponent } from './expenses.component';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    FormsModule,
    ExpenseModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule,
    ReactiveFormsModule,
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    StoreModule.forFeature('expenses', expensesReducer),
    EffectsModule.forFeature([ExpenseEffects]),
    SharedModule,
  ],
  providers: [
    ExpensesService,
  ],
  declarations: [ExpensesComponent],
  exports: [ExpensesComponent],
})
export class ExpensesModule { }
