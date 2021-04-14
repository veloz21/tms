import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActionTooltipComponent } from './action-tooltip.component';
import { ActionToolTipDirective } from './action-tooltip.directive';

@NgModule({
  declarations: [
    ActionTooltipComponent,
    ActionToolTipDirective,
  ],
  imports: [
    CommonModule,
    OverlayModule,
    RouterModule,
  ],
  exports: [
    ActionToolTipDirective
  ]
})
export class ActionTooltipModule { }
