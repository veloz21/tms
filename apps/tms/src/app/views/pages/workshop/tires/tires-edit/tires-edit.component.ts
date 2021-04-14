import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { CreateTire, UpdateTire } from '@tms/actions/tire.actions';
import { AVIABILITY_STATUS } from '@tms/core/enums';
import { SubheaderService } from '@tms/layout';
import { TireModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedTireId } from '@tms/selectors/tire.selectors';
import { TiresService } from '@tms/services';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'b404-tire-edit',
  templateUrl: './tires-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiresEditComponent implements OnInit, OnDestroy {

  public tire: TireModel;
  public tireId$: Observable<number>;
  public oldTire: TireModel;
  public selectedTab = 0;
  public loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean>;
  public tireForm: FormGroup;
  public hasFormErrors = false;
  public availableYears: number[] = [];
  public filteredColors: Observable<string[]>;
  public filteredManufactures: Observable<string[]>;
  public translateParams: TranslateParams;

  private ngUnsubscribe = new Subject();
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private tireFB: FormBuilder,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private tireService: TiresService,
    private translate: CustomTranslateService,
    private activatedRoute: ActivatedRoute,
    private subheaderService: SubheaderService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('WORKSHOP.TIRES.ENTITY'),
      entities: this.translate.instant('WORKSHOP.TIRES.ENTITIES'),
    };
  }

  ngOnInit() {
    this.tire = this.activatedRoute.snapshot.data.tire as TireModel;
    this.activatedRoute.data.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => {
      this.loadTire(data.tire);
    });
  }

  loadTire(_tire, fromService: boolean = false) {
    console.log(_tire);
    if (!_tire) {
      this.goBack('');
    }
    this.tire = _tire;
    this.tireId$ = of(_tire.id);
    this.oldTire = Object.assign({}, _tire);
    console.log(this.oldTire);
    this.initTire();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }

  // If product didn't find in store
  loadTireFromService(tireId) {
    this.tireService.getTireById(tireId).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.loadTire(res, true);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initTire() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.tire.id) {
      this.subheaderService.setBreadcrumbs([{
        title: this.translate.instant('WORKSHOP.WORKSHOP'),
        page: `/workshop`
      },
      {
        title: this.translate.instant('WORKSHOP.TIRES.ENTITIES.VALUE'),
        page: `/workshop/tires`
      },
      {
        title: this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams),
        page: `/workshop/tires/add`
      }
      ]);
      return;
    }

    this.subheaderService.setTitle(this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams));
    this.subheaderService.setBreadcrumbs([{
      title: this.translate.instant('WORKSHOP.WORKSHOP'),
      page: `/workshop`
    },
    {
      title: this.translate.instant('WORKSHOP.TIRES.ENTITIES.VALUE'),
      page: `/workshop/tires`
    },
    {
      title: this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams),
      page: `/workshop/tires/edit`,
      queryParams: {
        id: this.tire.id
      }
    }
    ]);
  }

  createForm() {
    this.tireForm = this.tireFB.group({
      serialNumber: [this.tire.serialNumber, [Validators.required]],
      rangeTraveled: [this.tire.rangeTraveled, [Validators.required]],
    });
  }

  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/workshop/tires?id=${id}`;
    this.router.navigateByUrl(url, {
      relativeTo: this.activatedRoute
    });
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/workshop/tires', {
      relativeTo: this.activatedRoute
    });
  }

  refreshTire(isNew: boolean = false, id = "") {
    this.loadingSubject.next(false);
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], {
        relativeTo: this.activatedRoute
      });
      return;
    }

    url = `/workshop/tires`;
    this.router.navigateByUrl(url, {
      relativeTo: this.activatedRoute
    });
  }

  reset() {
    this.tire = Object.assign({}, this.oldTire);
    this.createForm();
    this.hasFormErrors = false;
    this.tireForm.markAsPristine();
    this.tireForm.markAsUntouched();
    this.tireForm.updateValueAndValidity();
  }

  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.tireForm.controls;
    /** check form */
    if (this.tireForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let editedTire = this.prepareTire();

    if (!!editedTire.id) {
      this.updateTire(editedTire, withBack);
      this.router.navigateByUrl('/workshop/tires', {
        relativeTo: this.activatedRoute,
      });
      return;
    }

    this.addTire(editedTire, withBack);
  }

  prepareTire(): TireModel {
    const _tire = new TireModel();
    _tire.id = this.tire.id;
    _tire.id = this.tire.id;
    _tire.serialNumber = this.tireForm.get('serialNumber').value;
    _tire.rangeTraveled = this.tireForm.get('rangeTraveled').value;
    _tire.status = AVIABILITY_STATUS.AVAILABLE;
    return _tire;
  }

  addTire(_tire: TireModel, withBack: boolean = false) {
    this.loadingSubject.next(true);
    this.store.dispatch(new CreateTire({
      tire: _tire
    }));
    this.store.pipe(
      delay(1000),
      select(selectLastCreatedTireId),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(newId => {
      if (!newId) {
        return;
      }

      this.loadingSubject.next(false);
      if (withBack) {
        this.goBack(newId);
      } else {
        this.refreshTire(true, newId);
      }
    });
  }

  updateTire(_tire: TireModel, withBack: boolean = false) {
    this.loadingSubject.next(true);

    const updateTire: Update<TireModel> = {
      id: _tire.id,
      changes: _tire
    };

    this.store.dispatch(new UpdateTire({
      partialTire: updateTire,
      tire: _tire
    }));

    of(undefined).pipe(
      delay(3000),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => { // Remove this line
      if (withBack) {
        this.goBack(_tire.id);
      } else {
        this.refreshTire(false);
      }
    }); // Remove this line
  }

  getComponentTitle() {
    let result = this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams);
    if (!this.tire || !this.tire.id) {
      return result;
    }

    result = this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams) + ` - ${this.tire.serialNumber} ${this.tire.rangeTraveled}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
