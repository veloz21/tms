import { NgModule } from '@angular/core';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { Bits404TranslatePipe, CustomTranslateService, MissingTranslationHelper } from '@tms/translate';
import { CurrentTravelStatusPipe, NextTravelStatusPipe } from '../../core/_base/layout';
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
    NextTravelStatusPipe,
    Bits404TranslatePipe,
    CurrentTravelStatusPipe,
    MatInputCurrencyDirective,
  ],
  exports: [
    FileDropModule,
    Bits404TranslatePipe,
    NextTravelStatusPipe,
    ActionToolTipDirective,
    CurrentTravelStatusPipe,
    MatInputCurrencyDirective,
  ],
  providers: [CustomTranslateService]
})
export class SharedModule { }