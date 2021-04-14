import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActionTooltipComponent } from './action-tooltip.component';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[actionToolTip]'
})
export class ActionToolTipDirective implements OnInit, OnDestroy {

  //If this is specified then specified text will be showin in the tooltip
  @Input(`actionToolTip`) text: string;
  @Input() actionToolTipLink: string | any[];
  @Input() actionToolTipLinkText: string;
  @Output() actionToolTipAction = new EventEmitter();

  private isShowing = false;
  private _overlayRef: OverlayRef;

  constructor(private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef) { }

  /**
   * Init life cycle event handler
   */
  ngOnInit() {

    console.log('ActionToolTipDirective');
    console.log('text', this.text);

    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        // offsetY: -5,
      }]);

    this._overlayRef = this._overlay.create({ positionStrategy });

  }

  /**
   * This method will be called whenever mouse enters in the Host element
   * i.e. where this directive is applied
   * This method will show the tooltip by instantiating the McToolTipComponent and attaching to the overlay
   */
  @HostListener('mouseenter')
  show() {
    this.isShowing = true;
    //attach the component if it has not already attached to the overlay
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      const tooltipRef: ComponentRef<ActionTooltipComponent> = this._overlayRef.attach(new ComponentPortal(ActionTooltipComponent));
      tooltipRef.instance.text = this.text;
      tooltipRef.instance.link = this.actionToolTipLink;
      tooltipRef.instance.linkText = this.actionToolTipLinkText;
      tooltipRef.instance.action.subscribe(() => this.actionToolTipAction.emit());
      tooltipRef.instance.showAction.subscribe(show => {
        this.isShowing = show;
        if (!show) {
          this.closeToolTip();
        }
      });
    }
  }

  /**
   * This method will be called when mouse goes out of the host element
   * i.e. where this directive is applied
   * This method will close the tooltip by detaching the overlay from the view
   */
  @HostListener('mouseleave')
  hide() {
    this.isShowing = false;
    setTimeout(() => {
      this.closeToolTip();
    }, 500);
  }

  /**
   * Destroy lifecycle event handler
   * This method will make sure to close the tooltip
   * It will be needed in case when app is navigating to different page
   * and user is still seeing the tooltip; In that case we do not want to hang around the
   * tooltip after the page [on which tooltip visible] is destroyed
   */
  ngOnDestroy() {
    this.closeToolTip();
  }

  /**
   * This method will close the tooltip by detaching the component from the overlay
   */
  private closeToolTip() {
    if (this.isShowing) {
      return;
    }

    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }

}