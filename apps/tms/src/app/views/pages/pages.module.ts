import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { PartialsModule } from '../partials/partials.module';

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    PartialsModule,
  ],
  providers: []
})
export class PagesModule {
}
