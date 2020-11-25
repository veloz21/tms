import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { TireModel } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { TiresService } from '@services';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, share, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseAutocompleteComponent } from '../base-autocomplete/base-autocomplete.component';

@Component({
  selector: 'b404-tires-autocomplete',
  templateUrl: './tires-autocomplete.component.html',
  styleUrls: ['../base-autocomplete/base-autocomplete.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: TiresAutocompleteComponent
  }]
})
export class TiresAutocompleteComponent extends BaseAutocompleteComponent
  implements MatFormFieldControl<TireModel>, ControlValueAccessor, OnInit, OnDestroy {

  @Input() selectedModels: TireModel[] = [];
  @Output() selectedModelsChange = new EventEmitter<TireModel[]>();

  protected modelKey = 'id';
  protected modelSearchKey = 'Name';
  protected reloadOnInvoiceSenderChange = true;

  protected get newModel(): TireModel {
    return new TireModel();
  }

  public models$: Observable<TireModel[]>;

  @Input() public get value(): TireModel | null { return this.formControl.value; }
  public set value(model: TireModel | null) {
    if (!this.formControl) {
      return;
    }
    this.onChange(model);
    this.stateChanges.next();
  }

  @HostBinding() public id = `clients-autocomplete-${TiresAutocompleteComponent.nextId++}`;
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected fm: FocusMonitor,
    protected store: Store<AppState>,
    protected elRef: ElementRef<HTMLElement>,
    private tiresService: TiresService,
  ) {
    super(ngControl, fm, store, elRef);
  }

  ngOnInit() {
    setTimeout(() => {
      this.initFormControl();
    });
  }

  protected listenChanges() {
    this.models$ = this.formControl.valueChanges
      .pipe(
        debounceTime(300),
        filter(value => !!value),
        distinctUntilChanged((a: TireModel, b: TireModel) => a.serialNumber === b.serialNumber),
        tap(value => {
          this.modelText = value.serialNumber;
          this.modelTextChange.next(value.serialNumber);
        }),
        filter(value => this.lastSearchHadResults(value)),
        filter(() => this.changedModel ? this.changedModel = false : true),
        switchMap(value => {
          this.loading.next(true);

          const search = value.serialNumber;
          return this.tiresService.findQueryTires(search).pipe(
            tap(response => {
              this.haveModels = response.length > 0;

              this.lastSearch = {
                text: search,
                resultsFound: this.haveModels
              };

              this.loading.next(false);
            })
          );
        }),
        share(),
        takeUntil(this.ngUnsubscribe),
      );
  }

  protected shouldReloadPanel() {
    console.log(this.haveModels, this.loading.value, this.value && (this.value.serialNumber !== '' || this.value.id > 0));
    if (
      this.haveModels ||
      this.loading.value ||
      this.value && (this.value.serialNumber !== '' || this.value.id > 0)
    ) {
      return false;
    }
    return true;
  }

  public displayFn(model: TireModel): string {
    return model && model.serialNumber !== undefined ? model.serialNumber : '';
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
