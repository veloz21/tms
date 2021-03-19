import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

@Directive({
  selector: 'input[matInputCurrency]',
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatInputCurrencyDirective },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatInputCurrencyDirective),
      multi: true,
    }
  ]
})
export class MatInputCurrencyDirective {
  // tslint:disable-next-line:variable-name
  private _value: string | null;

  constructor(private elementRef: ElementRef<HTMLInputElement>,
  ) {
    console.log('created directive');
  }


  get value(): string | null {
    return this._value;
  }

  @Input('value')
  set value(value: string | null) {
    this._value = value;
    this.formatValue(value);
  }

  private formatValue(value: string | null) {
    if (value !== null) {
      this.elementRef.nativeElement.value = this.numberWithCommas(value);
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

  private unFormatValue() {
    const value = this.elementRef.nativeElement.value;
    this._value = value.replace(/[^\d.-]/g, '');
    if (value) {
      this.elementRef.nativeElement.value = this._value;
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    this._value = value.replace(/[^\d.-]/g, '');
    this._onChange(this._value);
  }

  @HostListener('blur')
  _onBlur() {
    this.formatValue(this._value);
  }

  @HostListener('focus')
  onFocus() {
    this.unFormatValue();
  }

  _onChange(value: any): void {
  }

  writeValue(value: any) {
    this._value = value;
    this.formatValue(this._value);
    // this._onChange(this._value);
  }

  registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
  }

  registerOnTouched() {
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}