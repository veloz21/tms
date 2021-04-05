import { NgModule } from '@angular/core';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { MatInputCurrencyDirective } from '../../core/_base/layout/directives/mat-input-currency.directive';
import { Bits404TranslatePipe, CustomTranslateService, MissingTranslationHelper } from '../../core/_base/layout/translate';
import { FileDropModule } from './components/file-drop/file-drop.module';

@NgModule({
  imports: [
    FileDropModule,
    TranslateModule.forChild({
      defaultLanguage: 'es',
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
    })
  ],
  declarations: [MatInputCurrencyDirective, Bits404TranslatePipe],
  exports: [MatInputCurrencyDirective, FileDropModule, Bits404TranslatePipe],
  providers: [CustomTranslateService]
})
export class SharedModule { }