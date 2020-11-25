import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TrucksService } from '@services';
import { TrucksAutocompleteComponent } from './trucks-autocomplete.component';

@NgModule({
  declarations: [TrucksAutocompleteComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  exports: [TrucksAutocompleteComponent],
  providers: [TrucksService]
})
export class TrucksAutocompleteModule { }
