import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CreateTruck, UpdateTruck } from '@tms/actions/truck.actions';
import { AVIABILITY_STATUS } from '@tms/core/enums';
import { SubheaderService } from '@tms/layout';
import { TruckModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedTruckId } from '@tms/selectors/trucks.selectors';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'b404-truck-edit',
  templateUrl: './truck-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruckEditComponent implements OnInit, OnDestroy {
  // Public properties
  truck: TruckModel;
  truckId$: Observable<number>;
  oldTruck: TruckModel;
  selectedTab = 0;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  truckForm: FormGroup;
  hasFormErrors = false;
  availableYears: number[] = [];

  private ngUnsuscribe = new Subject();
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private truckFB: FormBuilder,
    public dialog: MatDialog,
    private subheaderService: SubheaderService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.truck = this.activatedRoute.snapshot.data[' truck '];
    this.activatedRoute.data.pipe(
      takeUntil(this.ngUnsuscribe)
    ).subscribe(data => {
      this.loadTruck(data.truck);
    });
  }

  loadTruck(_truck, fromService: boolean = false) {
    if (!_truck) {
      this.goBack('');
    }
    this.truck = _truck;
    this.truckId$ = of(_truck.id);
    this.oldTruck = Object.assign({}, _truck);
    this.initTruck();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  initTruck() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.truck.id) {
      this.subheaderService.setBreadcrumbs([
        { title: this.translate.instant('WORKSHOP.WORKSHOP'), page: `/workshop` },
        { title: this.translate.instant('WORKSHOP.TRUCK.TEXT.TRUCK'), page: `/workshop/trucks` },
        { title: this.translate.instant('WORKSHOP.TRUCK.TEXT.CREATE_TITLE'), page: `/workshop/trucks/add` }
      ]);
      return;
    }
    this.subheaderService.setTitle(this.translate.instant('WORKSHOP.TRUCK.TEXT.EDIT_TRUCK'));
    this.subheaderService.setBreadcrumbs([
      { title: this.translate.instant('WORKSHOP.WORKSHOP'), page: `/workshop` },
      { title: this.translate.instant('WORKSHOP.TRUCK.TEXT.TRUCK'), page: `/workshop/trucks` },
      { title: this.translate.instant('WORKSHOP.TRUCK.TEXT.EDIT_TRUCK'), page: `/workshop/trucks/edit`, queryParams: { id: this.truck.id } }
    ]);
  }

  createForm() {
    this.truckForm = this.truckFB.group({
      truckModel: [this.truck.truckModel, [Validators.required]],
      brand: [this.truck.brand, [Validators.required]],
      serialNumber: [this.truck.serialNumber, [Validators.required]],
      motorNumber: [this.truck.motorNumber, [Validators.required]],
      maintenancePeriod: [this.truck.maintenancePeriod, [Validators.required]],
      initialRange: [this.truck.initialRange, [Validators.required]],
      rangeTraveled: [this.truck.rangeTraveled, [Validators.required]],
    });
  }

  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/workshop/trucks?id=${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/workshop/trucks', { relativeTo: this.activatedRoute });
  }

  refreshTruck(isNew: boolean = false, id = 0) {
    this.loadingSubject.next(false);
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
      return;
    }

    url = `/workshop/trucks`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  reset() {
    this.truck = Object.assign({}, this.oldTruck);
    this.createForm();
    this.hasFormErrors = false;
    this.truckForm.markAsPristine();
    this.truckForm.markAsUntouched();
    this.truckForm.updateValueAndValidity();
  }

  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.truckForm.controls;
    /** check form */
    if (this.truckForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let editedTruck = this.prepareTruck();

    if (editedTruck.id > 0) {
      this.updateTruck(editedTruck, withBack);
      this.router.navigateByUrl('/workshop/trucks', { relativeTo: this.activatedRoute });
      return;
    }

    this.addTruck(editedTruck, withBack);
  }

  prepareTruck(): TruckModel {
    const _truck = new TruckModel();
    _truck.id = this.truck.id;
    _truck.truckModel = this.truckForm.get('truckModel').value;
    _truck.brand = this.truckForm.get('brand').value;
    _truck.serialNumber = this.truckForm.get('serialNumber').value;
    _truck.motorNumber = this.truckForm.get('motorNumber').value;
    _truck.maintenancePeriod = this.truckForm.get('maintenancePeriod').value;
    _truck.initialRange = this.truckForm.get('initialRange').value;
    _truck.rangeTraveled = this.truckForm.get('rangeTraveled').value;
    _truck.circulationCard = '1';
    _truck.airbag = '1';
    _truck.dock = '1';
    _truck.status = AVIABILITY_STATUS.AVAILABLE;
    return _truck;
  }

  addTruck(_truck: TruckModel, withBack: boolean = false) {
    this.store.dispatch(new CreateTruck({ truck: _truck }));
    this.store.pipe(
      delay(1000),
      select(selectLastCreatedTruckId),
      takeUntil(this.ngUnsuscribe)
    ).subscribe(newId => {
      if (!newId) {
        return;
      }
      this.loadingSubject.next(false);
      if (withBack) {
        this.goBack(newId);
      } else {
        this.refreshTruck(true, newId);
      }
    });
  }

  updateTruck(_truck: TruckModel, withBack: boolean = false) {
    const updateTruck: Update<TruckModel> = {
      id: _truck.id,
      changes: _truck
    };
    this.store.dispatch(new UpdateTruck({
      partialTruck: updateTruck,
      truck: _truck
    }));
    of(undefined).pipe(delay(3000), takeUntil(this.ngUnsuscribe)).subscribe(() => {
      this.loadingSubject.next(false);
      if (withBack) {
        this.goBack(_truck.id);
      } else {
        this.refreshTruck(true);
      }
    });
  }

  getComponentTitle() {
    let result: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.CREATE_TITLE');
    if (!this.truck || !this.truck.id) {
      return result;
    }

    result = this.translate.instant('WORKSHOP.TRUCK.TEXT.EDIT_TRUCK') + ` - ${this.truck.truckModel} ${this.truck.brand} ${this.truck.serialNumber}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}

