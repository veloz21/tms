import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CreateMaintenance, UpdateMaintenance } from '@tms/actions/maintenance.actions';
import { TypesUtilsService } from '@tms/crud';
import { SubheaderService } from '@tms/layout';
import { BoxModel, EmployeeModel, MaintenanceModel, TruckModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedMaintenanceId } from '@tms/selectors/maintenance.selectors';
import { MaintenancesService } from '@tms/services';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'b404-maintenance-edit',
  templateUrl: './maintenance-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceEditComponent implements OnInit, OnDestroy {
  // Public properties
  maintenance: MaintenanceModel;
  maintenanceId$: Observable<number>;
  oldMaintenance: MaintenanceModel;
  selectedTab = 0;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  maintenanceForm: FormGroup;
  hasFormErrors = false;

  private ngUnsuscribe = new Subject();
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private maintenanceFB: FormBuilder,
    public dialog: MatDialog,
    private subheaderService: SubheaderService,
    private maintenanceService: MaintenancesService,
    private translate: TranslateService,
    private typesUtilsService: TypesUtilsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.maintenance = this.activatedRoute.snapshot.data[' maintenance '];
    this.activatedRoute.data.pipe(
      takeUntil(this.ngUnsuscribe)
    ).subscribe(data => {
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
    this.maintenanceService.getMaintenanceById(maintenanceId).pipe(
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => {
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
        { title: this.translate.instant('WORKSHOP.WORKSHOP'), page: `/workshop` },
        { title: this.translate.instant('WORKSHOP.MAINTENANCE.TEXT.MAINTENANCE'), page: `/workshop/maintenances` },
        { title: this.translate.instant('WORKSHOP.MAINTENANCE.TEXT.CREATE_TITLE'), page: `/workshop/maintenances/add` }
      ]);
      return;
    }
    this.subheaderService.setTitle(this.translate.instant('WORKSHOP.MAINTENANCE.TEXT.EDIT_MAINTENANCE')),
      this.subheaderService.setBreadcrumbs([
        { title: this.translate.instant('WORKSHOP.WORKSHOP'), page: `/workshop` },
        { title: this.translate.instant('WORKSHOP.MAINTENANCE.TEXT.MAINTENANCE'), page: `/workshop/maintenances` },
        { title: this.translate.instant('WORKSHOP.MAINTENANCE.TEXT.EDIT_MAINTENANCE'), page: `/workshop/maintenances/edit`, queryParams: { id: this.maintenance.id } }
      ]);
  }

  createForm() {
    this.maintenanceForm = this.maintenanceFB.group({
      truck: [this.maintenance.truck],
      box: [this.maintenance.box],
      mechanic: [this.maintenance.mechanic],
      comments: [this.maintenance.comments],
      reasons: [this.maintenance.reasons],
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
    this.router.navigateByUrl('/workshop/maintenances', { relativeTo: this.activatedRoute });
  }

  refreshMaintenance(isNew: boolean = false, id = 0) {
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
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let editedMaintenance = this.prepareMaintenance();

    if (editedMaintenance.id > 0) {
      this.updateMaintenance(editedMaintenance, withBack);
      this.router.navigateByUrl('/workshop/maintenances', { relativeTo: this.activatedRoute });
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
    _maintenance.times = { start: this.maintenanceForm.get('start').value, end: this.maintenanceForm.get('end').value };
    _maintenance.comments = this.maintenanceForm.get('comments').value;
    _maintenance.reasons = this.maintenanceForm.get('reasons').value;
    return _maintenance;
  }

  addMaintenance(_maintenance: MaintenanceModel, withBack: boolean = false) {
    this.loadingSubject.next(true);
    this.store.dispatch(new CreateMaintenance({ maintenance: _maintenance }));
    this.store.pipe(
      delay(1000),
      select(selectLastCreatedMaintenanceId),
      takeUntil(this.ngUnsuscribe)
    ).subscribe(newId => {
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
      changes: _maintenance
    };

    this.store.dispatch(new UpdateMaintenance({
      partialMaintenance: updateMaintenance,
      maintenance: _maintenance
    }));

    of(undefined).pipe(delay(3000), takeUntil(this.ngUnsuscribe)).subscribe(() => { // Remove this line
      if (withBack) {
        this.goBack(_maintenance.id);
      } else {
        this.refreshMaintenance(false);
      }
    });
  }

  getComponentTitle() {
    let result: string = this.translate.instant('WORKSHOP.MAINTENANCE.TEXT.CREATE_TITLE');
    if (!this.maintenance || !this.maintenance.id) {
      return result;
    }

    result = this.translate.instant('WORKSHOP.MAINTENANCE.TEXT.EDIT_MAINTENANCE') + ` - ${this.maintenance.mechanic} ${this.maintenance.times.start} ${this.maintenance.times.end}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
