import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
import { ExpenseComponent } from './expense.component';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule,
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    StoreModule.forFeature('expense', expensesReducer),
    EffectsModule.forFeature([ExpenseEffects]),
    SharedModule,
  ],
  providers: [
    ExpensesService,
  ],
  declarations: [ExpenseComponent],
  exports: [ExpenseComponent],
})
export class ExpenseModule { }
