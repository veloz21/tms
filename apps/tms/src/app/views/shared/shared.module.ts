import { NgModule } from '@angular/core';
import { MatInputCurrencyDirective } from '../../core/_base/layout/directives/mat-input-currency.directive';
import { FileDropModule } from './components/file-drop/file-drop.module';

@NgModule({
  imports: [FileDropModule],
  declarations: [MatInputCurrencyDirective],
  exports: [MatInputCurrencyDirective, FileDropModule],
})
export class SharedModule { }