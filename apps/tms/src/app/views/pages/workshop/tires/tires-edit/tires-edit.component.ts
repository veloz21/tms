import { CreateTire, UpdateTire } from '@actions/tire.actions';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AVIABILITY_STATUS } from '@core/enums';
import { Tire } from '@interfaces';
import { SubheaderService } from '@layout';
import { TireModel } from '@models';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@reducers';
import { selectLastCreatedTireId } from '@selectors/tire.selectors';
import { TiresService } from '@services';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'b404-tire-edit',
  templateUrl: './tires-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiresEditComponent implements OnInit, OnDestroy {
  tire: TireModel;
  tireId$: Observable<number>;
  oldTire: TireModel;
  selectedTab = 0;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  tireForm: FormGroup;
  hasFormErrors = false;
  availableYears: number[] = [];
  filteredColors: Observable<string[]>;
  filteredManufactures: Observable<string[]>;

  private ngUnsubscribe = new Subject();
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tireFB: FormBuilder,
    public dialog: MatDialog,
    private translate: TranslateService,
    private subheaderService: SubheaderService,
    private tireService: TiresService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.tire = this.activatedRoute.snapshot.data.tire as Tire;
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
        title: this.translate.instant('WORKSHOP.TIRES.TEXT.TIRES'),
        page: `/workshop/tires`
      },
      {
        title: this.translate.instant('WORKSHOP.TIRES.TEXT.CREATE_TITLE'),
        page: `/workshop/tires/add`
      }
      ]);
      return;
    }
    this.subheaderService.setTitle(this.translate.instant('WORKSHOP.TIRES.TEXT.EDIT_TIRE'));
    this.subheaderService.setBreadcrumbs([{
      title: this.translate.instant('WORKSHOP.WORKSHOP'),
      page: `/workshop`
    },
    {
      title: this.translate.instant('WORKSHOP.TIRES.TEXT.TIRES'),
      page: `/workshop/tires`
    },
    {
      title: this.translate.instant('WORKSHOP.TIRES.TEXT.EDIT_TIRE'),
      page: `/workshop/tires/edit`,
      queryParams: {
        id: this.tire._id
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

  refreshTire(isNew: boolean = false, id = 0) {
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

    if (editedTire.id > 0) {
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
    _tire._id = this.tire._id;
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
      id: _tire._id,
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
    let result = this.translate.instant('WORKSHOP.TIRES.TEXT.CREATE_TITLE');
    if (!this.tire || !this.tire.id) {
      return result;
    }

    result = this.translate.instant('WORKSHOP.TIRES.TEXT.EDIT_TIRE') + ` - ${this.tire.serialNumber} ${this.tire.rangeTraveled}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
