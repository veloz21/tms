import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Optional, Output, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { AppState } from '@tms/reducers';
import { ExtendedFormControl } from '@tms/utils/extended.form.control';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'b404-base-autocomplete',
  template: ``,
  styleUrls: ['./base-autocomplete.component.scss']
})
export class BaseAutocompleteComponent implements MatFormFieldControl<any>, ControlValueAccessor, OnDestroy {

  // MatFormFieldControl
  static nextId = 0;

  protected modelKey = 'id';
  protected modelSearchKey = 'Name';
  protected changedModel = false;
  protected clearedModel = false;
  protected reloadOnInvoiceSenderChange = false;
  protected loading = new BehaviorSubject<boolean>(false);
  protected lastSearch = {
    text: '',
    resultsFound: true,
  };

  protected formControl: ExtendedFormControl = new ExtendedFormControl();
  protected ngUnsubscribe = new Subject();

  public firstLoad = false;
  public haveModels = false;
  public loading$ = this.loading.asObservable();
  public models$: Observable<any[]>;

  @Input() multiple = false;
  @Input() fullWidth = true;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onKeyEnter = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onOptionSelected = new EventEmitter();

  // Replaced by childs
  @Input() selectedModels: any[];
  @Output() selectedModelsChange = new EventEmitter<any[]>();

  @Input() modelText: string;
  @Output() modelTextChange = new EventEmitter<string>();

  @ViewChild('inputElement', { read: MatAutocompleteTrigger, static: false }) trigger: MatAutocompleteTrigger;
  @ViewChild('inputElement', { static: false }) modelInput: ElementRef;

  protected get newModel(): any {
    return {};
  }

  // ControlValueAccessor --Replaced by childs
  @Input() public get value(): any | null { return this.formControl.value; }
  public set value(model: any | null) {
    this.onChange(model);
    this.stateChanges.next();
  }

  public stateChanges = new Subject<void>();

  // MatFormFieldControl --Replaced by childs
  @HostBinding() id = `clients-autocomplete-${BaseAutocompleteComponent.nextId++}`;

  // MatFormFieldControl
  @Input() public get placeholder() { return this._placeholder; }
  public set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  // tslint:disable-next-line: variable-name
  private _placeholder: string;

  // MatFormFieldControl
  public focused = false;
  @HostBinding('class.floating') get shouldLabelFloat() { return this.focused || !this.empty; }

  // MatFormFieldControl
  @Input() public get required() { return this._required; }
  public set required(req) {
    this._required = !!req;
    this.stateChanges.next();
  }
  // tslint:disable-next-line: variable-name
  protected _required = false;

  // MatFormFieldControl
  @Input() public get disabled(): boolean { return this._disabled; }
  public set disabled(value: boolean) {
    this._disabled = !!value;
    this.stateChanges.next();
  }
  // tslint:disable-next-line: variable-name
  private _disabled = false;

  // MatFormFieldControl
  public get empty() {
    if (this.selectedModels.length > 0) {
      return false;
    }

    if (!this.formControl || !this.formControl.value) {
      return true;
    }

    return !(
      (this.value[this.modelSearchKey] !== undefined && !!this.value[this.modelSearchKey]) ||
      (this.value[this.modelKey] !== undefined && !!this.value[this.modelKey])
    );
  }

  // MatFormFieldControl
  public get errorState() {
    // console.log('errorState', this.formControl ? this.formControl.errors : null, this.formControl ? this.formControl.touched : null);
    return !!this.formControl && this.formControl.errors !== null && !!this.formControl.touched;
    // return !!this.formControl && this.formControl.touched && (!this.value || !this.value[this.modelKey]);
  }

  public controlType = 'clients-autocomplete';
  @HostBinding('attr.aria-describedby') public describedBy = '';

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected fm: FocusMonitor,
    protected store: Store<AppState>,
    protected elRef: ElementRef<HTMLElement>,
  ) {
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    this.loading$.pipe(
      first(),
      tap(() => this.firstLoad = true)
    ).subscribe();
  }

  // ControlValueAccessor
  protected onChange = (_: any) => { };
  protected onTouch = () => { };

  // ControlValueAccessor
  writeValue(value: any): void {
    if (!!value) {
      this.value = Object.assign(this.newModel, value);
    } else {
      this.value = this.newModel;
    }

    this.onTouch();
    this.stateChanges.next();
  }

  // ControlValueAccessor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // ControlValueAccessor
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // ControlValueAccessor
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // MatFormFieldControl
  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  // MatFormFieldControl
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  // BaseAutocomplete
  protected shouldReloadPanel(): boolean {
    return false;
  }

  // BaseAutocomplete
  // @HostListener('click', ['$event'])
  onFocus(): void {
    if (!this.shouldReloadPanel()) {
      if (!this.trigger.panelOpen) {
        this.openAutocompletePanel();
      }
      return;
    }

    this.loading.next(true);
    this.value = this.newModel;
    this.openAutocompletePanel();
  }

  // BaseAutocomplete
  public displayFn(model): string {
    console.log('BaseAutocomplete displayFn', model);
    return '';
  }

  /**
   * Limpia el campo, se usa sólo cuando no es múltiple
   */
  clear(open = true): void {
    setTimeout(() => {
      this.clearedModel = true;
      this.modelInput.nativeElement.value = '';
      this.value = this.newModel;
    });

    // open menu
    if (open) {
      this.openAutocompletePanel();
    }
  }

  // BaseAutocomplete
  lastSearchHadResults(value): boolean {
    const search = String(value[this.modelSearchKey] !== undefined ? value[this.modelSearchKey] : value);
    return !search.includes(this.lastSearch.text) || search.includes(this.lastSearch.text) && this.lastSearch.resultsFound;
  }

  /**
   * Agregar el claveUnidade seleccionado y emite que tuvo cambios
   * @param event MatAutocompleteSelectedEvent el item seleccionado del autocomplete
   */
  selectedModel(model): void {
    const copyModel = Object.assign(this.newModel, model);
    if (this.multiple) {
      // Si no está ya seleccionado
      const alreadySelected = this.selectedModels.find(c => c[this.modelKey] === copyModel[this.modelKey]);
      if (!alreadySelected) {
        this.selectedModels.push(copyModel);
        this.selectedModelsChange.emit(this.selectedModels);
        this.onOptionSelected.emit();
      }

      setTimeout(() => {
        this.value = null;
        this.modelInput.nativeElement.value = '';
        this.changedModel = true;
        this.openAutocompletePanel();
      });
    } else {
      this.value = copyModel;
      this.onOptionSelected.emit();
    }
  }

  /**
   * Elimina un claveUnidade de la lista de claveUnidades asociados
   * @param claveUnidad Modelo del claveUnidade
   */
  removeModelChip(claveUnidad: any): void {
    setTimeout(() => {
      this.value = this.newModel;
      this.modelInput.nativeElement.value = '';
      this.selectedModels = this.selectedModels.filter(c => c[this.modelKey] !== claveUnidad[this.modelKey]);
      this.selectedModelsChange.next(this.selectedModels);
    });
  }

  // BaseAutocomplete
  keyUpEnter(): void {
    this.onKeyEnter.emit();
  }

  // BaseAutocomplete
  onInput(input: string): void {
    this.value = Object.assign(this.newModel, { [this.modelSearchKey]: input });
  }

  // BaseAutocomplete
  onBlur(): void {
    this.onTouch();
    // this.formControl.markAsTouched();
    // this.stateChanges.next();
  }

  // BaseAutocomplete
  openAutocompletePanel(ms: number = 0): void {
    if (this.trigger) {
      setTimeout(() => {
        this.trigger.openPanel();
      }, ms);
    }
  }

  protected listenChanges(): void { }

  protected initFormControl() {
    this.formControl = (this.ngControl.control as ExtendedFormControl);

    this.listenChanges();

    if (this.formControl.touchedChanges !== undefined) {
      this.formControl.touchedChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(touched => {
        if (touched) {
          this.stateChanges.next();
        }
      });
    }
  }

  // BaseAutocomplete
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

}
