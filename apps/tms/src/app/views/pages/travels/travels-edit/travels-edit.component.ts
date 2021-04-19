import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { CreateTravel, UpdateTravel } from '@tms/actions/travel.actions';
import { SubheaderService } from '@tms/layout';
import { TravelModel, TravelStatusModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedTravelId } from '@tms/selectors/travel.selectors';
import { TravelsService } from '@tms/services';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { ExpensesComponent } from '../expenses/expenses.component';

@Component({
  selector: 'b404-travels-edit',
  templateUrl: './travels-edit.component.html',
  styleUrls: ['./travels-edit.component.scss']
})
export class TravelsEditComponent implements OnInit, OnDestroy {

  public travel: TravelModel;
  public travelId$: Observable<string>;
  public oldTravel: TravelModel;
  public selectedTab = 0;
  public loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean>;
  public travelForm: FormGroup;
  public hasFormErrors = false;
  public companyTravelStatus: Partial<TravelStatusModel>[];

  public translateParams: TranslateParams;
  @ViewChild(ExpensesComponent) private expenses: ExpensesComponent;

  private ngUnsuscribe = new Subject();
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private travelFB: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    private travelService: TravelsService,
    private activatedRoute: ActivatedRoute,
    private translate: CustomTranslateService,
    private subheaderService: SubheaderService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('TRAVELS.ENTITY'),
      entities: this.translate.instant('TRAVELS.ENTITIES'),
    };
  }

  ngOnInit() {
    this.activatedRoute.data.pipe(takeUntil(this.ngUnsuscribe)).subscribe((data) => {
      this.companyTravelStatus = (data.travelStatus as TravelStatusModel[]).map(ts => new TravelStatusModel({
        ...ts,
        date: null,
        comments: '',
      }));

      this.loadTravel(data.travel as TravelModel);
    });
  }

  loadTravel(_travel: TravelModel, fromService: boolean = false) {
    if (!_travel) {
      this.goBack('');
    }
    this.travel = _travel;
    this.travelId$ = of(_travel.id);
    this.oldTravel = Object.assign({}, _travel);
    this.initTravel();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }

  // If didn't find in store
  loadTravelFromService(travelId) {
    this.travelService
      .getTravelById(travelId)
      .pipe(takeUntil(this.ngUnsuscribe))
      .subscribe((res) => {
        this.loadTravel(res, true);
      });
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  initTravel() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.travel.id) {
      this.subheaderService.setBreadcrumbs([
        {
          title: this.translate.instant('TRAVELS.ENTITIES.VALUE'),
          page: `/travels`,
        },
        {
          title: this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams),
          page: `/travels/add`,
        },
      ]);
      return;
    }

    this.subheaderService.setTitle(this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams));
    this.subheaderService.setBreadcrumbs([
      {
        title: this.translate.instant('TRAVELS.ENTITIES.VALUE'),
        page: `/travels`,
      },
      {
        title: this.translate.instant('TRAVELS.ENTITIES.VALUE'),
        page: `/travels`,
      },
      {
        title: this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams),
        page: `/travels/edit`,
        queryParams: {
          id: this.travel.id,
        },
      },
    ]);
  }

  getDateTime(fromDate: Date) {
    const date = new Date(fromDate);
    const time: NgbTimeStruct = {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
    return [date, time];
  }

  onSuggestionOrigin($oEvent?) {
    console.log($oEvent.suggestion.latlng);
    const origin = this.travelForm.get('origin') as FormGroup;
    origin.get('lat').setValue($oEvent.suggestion.latlng.lat);
    origin.get('lng').setValue($oEvent.suggestion.latlng.lng);
  }

  onSuggestionDestination($dEvent?) {
    console.log($dEvent.suggestion.latlng);
    const destination = this.travelForm.get('destination') as FormGroup;
    destination.get('lat').setValue($dEvent.suggestion.latlng.lat);
    destination.get('lng').setValue($dEvent.suggestion.latlng.lng);
  }

  createForm() {
    const status = this.travel.status && this.travel.status.length > 0 ? this.travel.status : this.companyTravelStatus;
    this.travelForm = this.travelFB.group({
      operator: [this.travel.operator],
      box: [this.travel.box],
      truck: [this.travel.truck],
      salePrice: [this.travel.salePrice],
      origin: this.travelFB.group({
        autocomplete: [''],
        lat: [''],
        lng: [''],
      }),
      destination: this.travelFB.group({
        autocomplete: [''],
        lat: [],
        lng: [],
      }),
      status: this.travelFB.array([
        ...status.map(s => this.travelStatus(s))
      ]),
      comments: [this.travel.comments, []],
      expenses: this.travelFB.group({
        expenses: this.travelFB.array([]),
      }),
    });
  }

  travelStatus(status: Partial<TravelStatusModel>) {
    return this.travelFB.group({
      id: [status.id],
      date: [status.date || null],
      name: [status.name],
      comments: [status.comments || ''],
    })
  }

  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/travel/travel?id=${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/travels', {
      relativeTo: this.activatedRoute,
    });
  }

  refreshTravel(isNew: boolean = false, id?: string) {
    this.loadingSubject.next(false);
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
      return;
    }

    url = `/travels`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  reset() {
    this.travel = Object.assign({}, this.oldTravel);
    this.createForm();
    this.hasFormErrors = false;
    this.travelForm.markAsPristine();
    this.travelForm.markAsUntouched();
    this.travelForm.updateValueAndValidity();
  }

  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    if (this.travelForm.invalid) {
      this.travelForm.markAllAsTouched();
      this.hasFormErrors = true;
      console.log(this.travelForm);
      return;
    }

    const editedTravel = this.prepareTravel();
    if (!!editedTravel.id) {
      this.updateTravel(editedTravel, withBack);
      this.router.navigateByUrl('/travels', {
        relativeTo: this.activatedRoute,
      });
      return;
    }

    this.addTravel(editedTravel, withBack);
  }

  prepareTravel(): TravelModel {
    const _travel = new TravelModel();
    _travel.id = this.travel.id;
    _travel.operator = this.travelForm.get('operator').value;
    _travel.box = this.travelForm.get('box').value;
    _travel.truck = this.travelForm.get('truck').value;
    _travel.salePrice = this.travelForm.get('salePrice').value;
    const origin = this.travelForm.get('origin') as FormGroup;
    const destination = this.travelForm.get('destination') as FormGroup;
    _travel.locations = {
      origin: {
        type: 'Point',
        // coordinates: [this.travelForm.get('origin').value, this.travelForm.get('origin').value],
        // lng, lat
        coordinates: [origin.get('lng').value, origin.get('lat').value],
      },
      destination: {
        type: 'Point',
        // lng, lat
        coordinates: [destination.get('lng').value, destination.get('lat').value],
        // coordinates: [this.travelForm.get('destination').value, this.travelForm.get('destination').value],
      },
    };

    _travel.status = [];
    (this.travelForm.get('status') as FormArray).controls.map((statusForm: FormGroup) => {
      const status = new TravelStatusModel({
        id: statusForm.get('id').value,
        date: statusForm.get('date').value,
        name: statusForm.get('name').value,
        comments: statusForm.get('comments').value,
      });
      _travel.status.push(status);
    });

    if (_travel.status.length > 0) {
      _travel.status[0].date = new Date();
    }

    _travel.currentStatus = _travel.status.length > 0 ? _travel.status[0].id : null;
    _travel.comments = this.travelForm.get('comments').value;
    _travel.expenses = this.expenses.prepareExpenses() || [];
    return _travel;
  }

  addTravel(_travel: TravelModel, withBack: boolean = false) {
    this.loadingSubject.next(true);
    this.store.dispatch(new CreateTravel({ travel: _travel }));
    this.store.pipe(delay(1000), select(selectLastCreatedTravelId), takeUntil(this.ngUnsuscribe)).subscribe((newId) => {
      if (!newId) {
        return;
      }

      this.loadingSubject.next(false);
      if (withBack) {
        this.goBack(newId);
      } else {
        this.refreshTravel(true, newId);
      }
    });
  }

  updateTravel(_travel: TravelModel, withBack: boolean = false) {
    this.loadingSubject.next(true);

    const updateTravel: Update<TravelModel> = {
      id: _travel.id,
      changes: _travel,
    };

    this.store.dispatch(
      new UpdateTravel({
        partialTravel: updateTravel,
        travel: _travel,
      })
    );

    of(undefined)
      .pipe(delay(3000), takeUntil(this.ngUnsuscribe))
      .subscribe(() => {
        // Remove this line
        if (withBack) {
          this.goBack(_travel.id);
        } else {
          this.refreshTravel(false);
        }
      });
  }

  getComponentTitle() {
    let result: string = this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams);
    if (!this.travel || !this.travel.id) {
      return result;
    }

    result = this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams) + ` - ${this.travel.operator.firstName} | ${this.travel.box.nickname} | ${this.travel.truck.nickname}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  onClear($event) {
    console.log($event);
  }

}
