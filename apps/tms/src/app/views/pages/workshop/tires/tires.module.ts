import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TiresRoutingModule } from './tires-routing.module';

@NgModule({
  imports: [
    TiresRoutingModule
  ],
  exports: [RouterModule],
})
export class TiresModule { }
