import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { CreateMaintenance, UpdateMaintenance } from '@tms/actions/maintenance.actions';
import { SubheaderService } from '@tms/layout';
import { BoxModel, EmployeeModel, MaintenanceModel, TruckModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedMaintenanceId } from '@tms/selectors/maintenance.selectors';
import { MaintenancesService } from '@tms/services';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'b404-maintenance-edit',
  templateUrl: './maintenance-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceEditComponent implements OnInit, OnDestroy {

  public maintenance: MaintenanceModel;
  public maintenanceId$: Observable<number>;
  public oldMaintenance: MaintenanceModel;
  public selectedTab = 0;
  public loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean>;
  public maintenanceForm: FormGroup;
  public hasFormErrors = false;

  public translateParams: TranslateParams;

  private ngUnsuscribe = new Subject();
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private maintenanceFB: FormBuilder,
    private translate: CustomTranslateService,
    private activatedRoute: ActivatedRoute,
    private subheaderService: SubheaderService,
    private maintenanceService: MaintenancesService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('WORKSHOP.MAINTENANCE.ENTITY'),
      entities: this.translate.instant('WORKSHOP.MAINTENANCE.ENTITIES'),
    };
  }

  ngOnInit() {
    this.maintenance = this.activatedRoute.snapshot.data[' maintenance '];
    this.activatedRoute.data
      .pipe(takeUntil(this.ngUnsuscribe))
      .subscribe((data) => {
        this.loadMaintenance(data.maintenance);
      });
  }

  loadMaintenance(_maintenance, fromService: boolean = false) {
    console.log(_maintenance);
    if (!_maintenance) {
      this.goBack('');
    }
    this.maintenance = _maintenance;
    this.maintenanceId$ = of(_maintenance.id);
    this.oldMaintenance = Object.assign({}, _maintenance);
    this.initMaintenance();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }

  // If product didn't find in store
  loadMaintenanceFromService(maintenanceId) {
    this.maintenanceService
      .getMaintenanceById(maintenanceId)
      .pipe(takeUntil(this.ngUnsuscribe))
      .subscribe((res) => {
        this.loadMaintenance(res, true);
      });
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  initMaintenance() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.maintenance.id) {
      this.subheaderService.setBreadcrumbs([
        {
          title: this.translate.instant('WORKSHOP.WORKSHOP'),
          page: `/workshop`,
        },
        {
          title: this.translate.instant('WORKSHOP.MAINTENANCE.ENTITIES.VALUE'),
          page: `/workshop/maintenances`,
        },
        {
          title: this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams),
          page: `/workshop/maintenances/add`,
        },
      ]);
      return;
    }

    this.subheaderService.setTitle(this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams)),
      this.subheaderService.setBreadcrumbs([
        {
          title: this.translate.instant('WORKSHOP.WORKSHOP'),
          page: `/workshop`,
        },
        {
          title: this.translate.instant('WORKSHOP.MAINTENANCE.ENTITIES.VALUE'),
          page: `/workshop/maintenances`,
        },
        {
          title: this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams),
          page: `/workshop/maintenances/edit`,
          queryParams: { id: this.maintenance.id },
        },
      ]);
  }

  createForm() {
    this.maintenanceForm = this.maintenanceFB.group({
      truck: [this.maintenance.truck],
      box: [this.maintenance.box],
      mechanic: [this.maintenance.mechanic],
      comments: [this.maintenance.comments],
      reasons: [this.maintenance.reasons],
      price: [this.maintenance.price],
      start: [this.maintenance.times.start, [Validators.nullValidator]],
      end: [this.maintenance.times.end, [Validators.nullValidator]],
    });
  }

  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/workshop/maintenances?id=${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/workshop/maintenances', {
      relativeTo: this.activatedRoute,
    });
  }

  refreshMaintenance(isNew: boolean = false, id?: string) {
    this.loadingSubject.next(false);
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
      return;
    }

    url = `/workshop/maintenances`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  reset() {
    this.maintenance = Object.assign({}, this.oldMaintenance);
    this.createForm();
    this.hasFormErrors = false;
    this.maintenanceForm.markAsPristine();
    this.maintenanceForm.markAsUntouched();
    this.maintenanceForm.updateValueAndValidity();
  }

  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.maintenanceForm.controls;
    /** check form */
    if (this.maintenanceForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    const editedMaintenance = this.prepareMaintenance();
    if (!!editedMaintenance.id) {
      this.updateMaintenance(editedMaintenance, withBack);
      this.router.navigateByUrl('/workshop/maintenances', {
        relativeTo: this.activatedRoute,
      });
      return;
    }

    this.addMaintenance(editedMaintenance, withBack);
  }

  prepareMaintenance(): MaintenanceModel {
    const _maintenance = new MaintenanceModel();
    _maintenance.id = this.maintenance.id;
    _maintenance.truck = this.maintenanceForm.get('truck').value || new TruckModel();
    _maintenance.box = this.maintenanceForm.get('box').value || new BoxModel();
    _maintenance.mechanic = this.maintenanceForm.get('mechanic').value || new EmployeeModel();
    _maintenance.price = this.maintenanceForm.get('price').value;
    _maintenance.times = {
      start: this.maintenanceForm.get('start').value,
      end: this.maintenanceForm.get('end').value,
    };
    _maintenance.comments = this.maintenanceForm.get('comments').value;
    _maintenance.reasons = this.maintenanceForm.get('reasons').value;
    return _maintenance;
  }

  addMaintenance(_maintenance: MaintenanceModel, withBack: boolean = false) {
    this.loadingSubject.next(true);
    this.store.dispatch(new CreateMaintenance({ maintenance: _maintenance }));
    this.store
      .pipe(
        delay(1000),
        select(selectLastCreatedMaintenanceId),
        takeUntil(this.ngUnsuscribe)
      )
      .subscribe((newId) => {
        if (!newId) {
          return;
        }

        this.loadingSubject.next(false);
        if (withBack) {
          this.goBack(newId);
        } else {
          this.refreshMaintenance(true, newId);
        }
      });
  }

  updateMaintenance(_maintenance: MaintenanceModel, withBack: boolean = false) {
    this.loadingSubject.next(true);

    const updateMaintenance: Update<MaintenanceModel> = {
      id: _maintenance.id,
      changes: _maintenance,
    };

    this.store.dispatch(
      new UpdateMaintenance({
        partialMaintenance: updateMaintenance,
        maintenance: _maintenance,
      })
    );

    of(undefined)
      .pipe(delay(3000), takeUntil(this.ngUnsuscribe))
      .subscribe(() => {
        // Remove this line
        if (withBack) {
          this.goBack(_maintenance.id);
        } else {
          this.refreshMaintenance(false);
        }
      });
  }

  getComponentTitle() {
    let result: string = this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams);
    if (!this.maintenance || !this.maintenance.id) {
      return result;
    }

    result =
      this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams) +
      ` - ${this.maintenance.mechanic.firstName} ${this.maintenance.times.start} ${this.maintenance.times.end}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
