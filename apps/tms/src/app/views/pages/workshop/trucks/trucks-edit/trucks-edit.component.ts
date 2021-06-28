import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { CreateTruck, UpdateTruck } from '@tms/actions/truck.actions';
import { CheckDistanceValidator } from '@tms/crud';
import { AVIABILITY_STATUS } from '@tms/enums';
import { SubheaderService } from '@tms/layout';
import { TruckModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedTruckId } from '@tms/selectors/trucks.selectors';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { TiresSharedEditComponent } from '../../tires/tires-shared-edit/tires-shared-edit.component';

@Component({
  selector: 'b404-trucks-edit',
  templateUrl: './trucks-edit.component.html',
  styleUrls: ['./trucks-edit.component.scss'],
})
export class TrucksEditComponent implements OnInit, OnDestroy {
  public truck: TruckModel;
  public truckId$: Observable<number>;
  public oldTruck: TruckModel;
  public selectedTab = 0;
  public loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean>;
  public truckForm: FormGroup;
  public hasFormErrors = false;
  public imageUrl: string;
  public imageFile: File;
  public translateParams: TranslateParams;

  @ViewChild(TiresSharedEditComponent) private tires: TiresSharedEditComponent;
  private ngUnsuscribe = new Subject();
  constructor(private router: Router, public dialog: MatDialog, private truckFB: FormBuilder, private store: Store<AppState>, private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private translate: CustomTranslateService, private subheaderService: SubheaderService) {
    this.translateParams = {
      entity: this.translate.instant('WORKSHOP.TRUCK.ENTITY'),
      entities: this.translate.instant('WORKSHOP.TRUCK.ENTITIES'),
    };
  }

  ngOnInit() {
    this.truck = this.activatedRoute.snapshot.data[' truck '];
    this.activatedRoute.data.pipe(takeUntil(this.ngUnsuscribe)).subscribe((data) => {
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
        {
          title: this.translate.instant('WORKSHOP.WORKSHOP'),
          page: `/workshop`,
        },
        {
          title: this.translate.instant('WORKSHOP.TRUCK.ENTITIES.VALUE'),
          page: `/workshop/trucks`,
        },
        {
          title: this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams),
          page: `/workshop/trucks/add`,
        },
      ]);
      return;
    }

    this.subheaderService.setTitle(this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams));
    this.subheaderService.setBreadcrumbs([
      { title: this.translate.instant('WORKSHOP.WORKSHOP'), page: `/workshop` },
      {
        title: this.translate.instant('WORKSHOP.TRUCK.ENTITIES.VALUE'),
        page: `/workshop/trucks`,
      },
      {
        title: this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams),
        page: `/workshop/trucks/edit`,
        queryParams: { id: this.truck.id },
      },
    ]);
  }

  createForm() {
    this.truckForm = this.truckFB.group(
      {
        truckModel: [this.truck.truckModel, [Validators.required]],
        nickName: [this.truck.nickname],
        brand: [this.truck.brand, [Validators.required]],
        serialNumber: [this.truck.serialNumber, [Validators.required]],
        motorNumber: [this.truck.motorNumber, [Validators.required]],
        maintenancePeriod: [this.truck.maintenancePeriod, [Validators.required]],
        price: [this.truck.price],
        initialRange: [this.truck.initialRange, [Validators.required]],
        rangeTraveled: [this.truck.rangeTraveled, [Validators.required]],
        image: [],
        tires: this.truckFB.array([]),
      },
      {
        validator: CheckDistanceValidator.CheckDistance,
      }
    );
  }

  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/workshop/trucks?id=${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/workshop/trucks', {
      relativeTo: this.activatedRoute,
    });
  }

  refreshTruck(isNew: boolean = false, id?: string) {
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
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    const editedTruck = this.prepareTruck();
    if (!!editedTruck.id) {
      this.updateTruck(editedTruck, withBack);
      this.router.navigateByUrl('/workshop/trucks', {
        relativeTo: this.activatedRoute,
      });
      return;
    }

    this.addTruck(editedTruck, withBack);
  }

  prepareTruck(): TruckModel {
    const _truck = new TruckModel();
    _truck.id = this.truck.id;
    _truck.truckModel = this.truckForm.get('truckModel').value;
    _truck.nickname = this.truckForm.get('nickName').value;
    _truck.brand = this.truckForm.get('brand').value;
    _truck.serialNumber = this.truckForm.get('serialNumber').value;
    _truck.motorNumber = this.truckForm.get('motorNumber').value;
    _truck.maintenancePeriod = this.truckForm.get('maintenancePeriod').value;
    _truck.initialRange = this.truckForm.get('initialRange').value;
    _truck.rangeTraveled = this.truckForm.get('rangeTraveled').value;
    _truck.price = this.truckForm.get('price').value;
    _truck.circulationCard = '1';
    _truck.airbag = '1';
    _truck.dock = '1';
    _truck.status = AVIABILITY_STATUS.AVAILABLE;
    _truck.tires = this.tires?.prepareTires() || [];
    return _truck;
  }

  addTruck(_truck: TruckModel, withBack: boolean = false) {
    this.store.dispatch(new CreateTruck({ truck: _truck }));
    this.store.pipe(delay(1000), select(selectLastCreatedTruckId), takeUntil(this.ngUnsuscribe)).subscribe((newId) => {
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
      changes: _truck,
    };
    this.store.dispatch(
      new UpdateTruck({
        partialTruck: updateTruck,
        truck: _truck,
      })
    );
    of(undefined)
      .pipe(delay(3000), takeUntil(this.ngUnsuscribe))
      .subscribe(() => {
        this.loadingSubject.next(false);
        if (withBack) {
          this.goBack(_truck.id);
        } else {
          this.refreshTruck(true);
        }
      });
  }

  getComponentTitle() {
    let result: string = this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams);
    if (!this.truck || !this.truck.id) {
      return result;
    }

    result = this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams) + ` - ${this.truck.truckModel} ${this.truck.brand} ${this.truck.serialNumber}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  setImageAsUrl(file: File) {
    const reader = new FileReader();
    reader.onload = (Event: any) => {
      this.imageUrl = Event.target.result;
      setTimeout(() => this.cdr.detectChanges(), 100);
    };
    reader.readAsDataURL(file);
    this.truckForm.get('image').setValue(file);
  }
}
