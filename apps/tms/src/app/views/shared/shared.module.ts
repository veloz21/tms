import { NgModule } from '@angular/core';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { Bits404DatePipe, CurrentTravelStatusPipe, NextTravelStatusPipe } from '@tms/layout';
import { Bits404TranslatePipe, CustomTranslateService, MissingTranslationHelper } from '@tms/translate';
import { MatInputCurrencyDirective } from '../../core/_base/layout/directives/mat-input-currency.directive';
import { ActionToolTipDirective } from './action-tooltip/action-tooltip.directive';
import { ActionTooltipModule } from './action-tooltip/action-tooltip.module';
import { FileDropModule } from './components/file-drop/file-drop.module';

@NgModule({
  imports: [
    FileDropModule,
    ActionTooltipModule,
    TranslateModule.forChild({
      defaultLanguage: 'es',
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
    })
  ],
  declarations: [
    Bits404DatePipe,
    NextTravelStatusPipe,
    Bits404TranslatePipe,
    CurrentTravelStatusPipe,
    MatInputCurrencyDirective,
  ],
  exports: [
    FileDropModule,
    Bits404DatePipe,
    Bits404TranslatePipe,
    NextTravelStatusPipe,
    ActionToolTipDirective,
    CurrentTravelStatusPipe,
    MatInputCurrencyDirective,
  ],
  providers: [CustomTranslateService]
})
export class SharedModule { }