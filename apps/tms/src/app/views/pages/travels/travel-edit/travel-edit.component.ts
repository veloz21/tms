import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CreateTravel, UpdateTravel } from '@tms/actions/travel.actions';
import { TypesUtilsService } from '@tms/crud';
import { SubheaderService } from '@tms/layout';
import { TravelModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedTravelId } from '@tms/selectors/travel.selectors';
import { TravelsService } from '@tms/services';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'b404-travel-edit',
  templateUrl: './travel-edit.component.html',
  styleUrls: ['./travel-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravelEditComponent implements OnInit, OnDestroy {
  // Public properties

  travel: TravelModel;
  travelId$: Observable<number>;
  oldTravel: TravelModel;
  selectedTab = 0;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  travelForm: FormGroup;
  hasFormErrors = false;
  // sticky portlet header margin
  private headerMargin: number;
  private ngUnsuscribe = new Subject();

  constructor(private store: Store<AppState>, private activatedRoute: ActivatedRoute, private router: Router, private travelFB: FormBuilder, public dialog: MatDialog, private translate: TranslateService, private subheaderService: SubheaderService, private travelService: TravelsService, private typesUtilsService: TypesUtilsService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.travel = this.activatedRoute.snapshot.data[' travel '];
    this.activatedRoute.data.pipe(takeUntil(this.ngUnsuscribe)).subscribe((data) => {
      this.loadTravel(data.travel);
    });

    // sticky portlet header
    window.onload = () => {
      const style = getComputedStyle(document.getElementById('kt_header'));
      this.headerMargin = parseInt(style.height, 0);
    };
  }

  loadTravel(_travel, fromService: boolean = false) {
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
          title: this.translate.instant('TRAVEL.TRAVEL.TEXT.TRAVEL'),
          page: `/travels`,
        },
        {
          title: this.translate.instant('TRAVEL.TRAVEL.TEXT.TRAVEL'),
          page: `/travels`,
        },
        {
          title: this.translate.instant('TRAVEL.TRAVEL.TEXT.CREATE_TITLE'),
          page: `/travels/add`,
        },
      ]);
      return;
    }
    this.subheaderService.setTitle(this.translate.instant('TRAVEL.TRAVEL.TEXT.EDIT_TRAVEL'));
    this.subheaderService.setBreadcrumbs([
      {
        title: this.translate.instant('TRAVEL.TRAVEL.TEXT.TRAVEL'),
        page: `/travels`,
      },
      {
        title: this.translate.instant('TRAVEL.TRAVEL.TEXT.TRAVEL'),
        page: `/travels`,
      },
      {
        title: this.translate.instant('TRAVEL.TRAVEL.TEXT.EDIT_TRAVEL'),
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
    this.travelForm = this.travelFB.group({
      operator: [this.travel.operator],
      box: [this.travel.box],
      truck: [this.travel.truck],
      cost: [],
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
      loadingDate: [],
      loadingTime: [],
      unloadingDate: [],
      unloadingTime: [],
      originArriveDate: [],
      originArriveTime: [],
      destinationArriveDate: [],
      destinationArriveTime: [],
      comments: [this.travel.comments, []],
    });
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
    const controls = this.travelForm.controls;
    /** check form */
    if (this.travelForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      this.selectedTab = 0;
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
    const getDate = (dateName: string, timeName: string) => {
      const ioDate: Date = this.travelForm.get(dateName).value;
      if (!ioDate) {
        return null;
      }
      const receptionTime: NgbTimeStruct = this.travelForm.get(timeName).value;
      ioDate.setHours(receptionTime.hour);
      ioDate.setMinutes(receptionTime.minute);
      return ioDate;
    };
    const _travel = new TravelModel();
    _travel.id = this.travel.id;
    _travel.operator = this.travelForm.get('operator').value;
    _travel.box = this.travelForm.get('box').value;
    _travel.truck = this.travelForm.get('truck').value;

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
    _travel.times = {
      loading: getDate('loadingDate', 'loadingTime'),
      unloading: getDate('unloadingDate', 'unloadingTime'),
      originArrive: getDate('originArriveDate', 'originArriveTime'),
      destinationArrive: getDate('destinationArriveDate', 'destinationArriveTime'),
    };
    _travel.comments = this.travelForm.get('comments').value;
    console.log(_travel);
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
    let result: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.CREATE_TITLE');
    if (!this.travel || !this.travel.id) {
      return result;
    }

    result = this.translate.instant('TRAVEL.TRAVEL.TEXT.EDIT_TRAVEL') + ` - ${this.travel.operator.firstName} ${this.travel.box.serialNumber} ${this.travel.truck.serialNumber}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  onClear($event) {
    console.log($event);
  }
}
