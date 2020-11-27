import { NgModule } from '@angular/core';
import { TravelRoutingModule } from './travel-routing.module';
import { TravelComponent } from './travel.component';

@NgModule({
  imports: [
    TravelRoutingModule,
  ],
  providers: [],
  entryComponents: [],
  declarations: [TravelComponent]
})
export class TravelModule { }
