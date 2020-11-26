import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import * as objectPath from 'object-path';

export interface HeaderOptions {
  classic?: any;
  offset?: any;
  minimize?: any;
}

/**
 * Configure Header
 */
@Directive({
  selector: '[ktHeader]',
  exportAs: 'ktHeader',
})
export class HeaderDirective implements AfterViewInit {
  @Input() options: HeaderOptions = {};

  /**
   * Directive Constructor
   * @param el: ElementRef
   */
  constructor(private el: ElementRef) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.setupOptions();

    const header = new KTHeader(this.el.nativeElement, this.options);
  }

  /**
   * Setup options to header
   */
  private setupOptions() {
    this.options = {
      classic: {
        desktop: true,
        mobile: false
      },
    };

    if (this.el.nativeElement.getAttribute('data-ktheader-minimize') == '1') {
      objectPath.set(this.options, 'minimize', {
        desktop: {
          on: 'b404-header--minimize'
        },
        mobile: {
          on: 'b404-header--minimize'
        }
      });
      objectPath.set(this.options, 'offset', {
        desktop: 200,
        mobile: 150
      });
    }
  }
}
