import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'b404-action-tooltip',
  templateUrl: './action-tooltip.component.html',
  styleUrls: ['./action-tooltip.component.scss']
})
export class ActionTooltipComponent implements OnInit {

  @Input() text: string;
  @Input() link: string | any[];
  @Input() linkText: string;
  @Input() action = new EventEmitter<boolean>();
  @Output() showAction = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('mouseenter')
  show() {
    this.showAction.emit(true);
  }

  @HostListener('mouseleave')
  hideAction() {
    this.showAction.emit(false);
  }

  openAction() {
    this.action.emit();
  }

}
