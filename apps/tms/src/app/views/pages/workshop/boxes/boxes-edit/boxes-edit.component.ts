import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { CreateBox, UpdateBox } from '@tms/actions/box.actions';
import { AVIABILITY_STATUS } from '@tms/core/enums';
import { SubheaderService } from '@tms/layout';
import { BoxModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedBoxId } from '@tms/selectors/boxes.selectors';
import { BoxesService } from '@tms/services';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { TiresSharedEditComponent } from '../../tires/tires-shared-edit/tires-shared-edit.component';

@Component({
  selector: 'b404-boxes-edit',
  templateUrl: './boxes-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesEditComponent implements OnInit, OnDestroy {
  public box: BoxModel;
  public boxId$: Observable<string>;
  public oldBox: BoxModel;
  public selectedTab = 0;
  public loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean>;
  public boxForm: FormGroup;
  public hasFormErrors = false;

  public imageUrl: string;
  public imageFile: File;
  public translateParams: TranslateParams;

  @ViewChild(TiresSharedEditComponent) private tires: TiresSharedEditComponent;
  private ngUnsubscribe = new Subject();
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private boxFB: FormBuilder,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    private boxService: BoxesService,
    private activatedRoute: ActivatedRoute,
    private translate: CustomTranslateService,
    private subheaderService: SubheaderService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('WORKSHOP.BOXES.ENTITY'),
      entities: this.translate.instant('WORKSHOP.BOXES.ENTITIES'),
    };
  }

  ngOnInit() {
    this.box = this.activatedRoute.snapshot.data[' box '];
    this.activatedRoute.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        console.log(data.box);
        this.loadBox(data.box);
      });
  }

  loadBox(_box: BoxModel, fromService: boolean = false) {
    if (!_box) {
      this.goBack('');
    }
    this.box = _box;
    this.boxId$ = of(_box.id);
    this.oldBox = Object.assign({}, _box);
    this.initBox();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }

  // If product didn't find in store
  loadBoxFromService(boxId) {
    this.boxService
      .getBoxById(boxId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.loadBox(res, true);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initBox() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.box.id) {
      this.subheaderService.setBreadcrumbs([
        {
          title: this.translate.instant('WORKSHOP.WORKSHOP'),
          page: `/workshop`,
        },
        {
          title: this.translate.instant('WORKSHOP.BOXES.ENTITIES.VALUE'),
          page: `/workshop/boxes`,
        },
        {
          title: this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams),
          page: `/workshop/boxes/add`,
        },
      ]);
      return;
    }

    this.subheaderService.setTitle(this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams));
    this.subheaderService.setBreadcrumbs([
      {
        title: this.translate.instant('WORKSHOP.WORKSHOP'),
        page: `/workshop`,
      },
      {
        title: this.translate.instant('WORKSHOP.BOXES.ENTITIES.VALUE'),
        page: `/workshop/boxes`,
      },
      {
        title: this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams),
        page: `/workshop/boxes/edit`,
        queryParams: {
          id: this.box.id,
        },
      },
    ]);
  }

  createForm() {
    this.boxForm = this.boxFB.group({
      boxModel: [this.box.boxModel, [Validators.required]],
      nickName: [this.box.nickname],
      type: [this.box.type, [Validators.required]],
      rangeTraveled: [this.box.rangeTraveled, [Validators.required]],
      serialNumber: [this.box.serialNumber],
      price: [this.box.price],
      brand: [this.box.brand],
      image: [],
      tires: this.boxFB.array([])
    });
  }

  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/workshop/boxes?id=${id}`;
    this.router.navigateByUrl(url, {
      relativeTo: this.activatedRoute,
    });
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/workshop/boxes', {
      relativeTo: this.activatedRoute,
    });
  }

  refreshBox(isNew: boolean = false, id?: string) {
    this.loadingSubject.next(false);
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], {
        relativeTo: this.activatedRoute,
      });
      return;
    }

    url = `/workshop/boxes`;
    this.router.navigateByUrl(url, {
      relativeTo: this.activatedRoute,
    });
  }

  reset() {
    this.box = Object.assign({}, this.oldBox);
    this.createForm();
    this.hasFormErrors = false;
    this.boxForm.markAsPristine();
    this.boxForm.markAsUntouched();
    this.boxForm.updateValueAndValidity();
  }

  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.boxForm.controls;
    /** check form */
    if (this.boxForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    const editedBox = this.prepareBox();
    if (!!editedBox.id) {
      this.updateBox(editedBox, withBack);
      return;
    }

    this.addBox(editedBox, withBack);
  }

  prepareBox(): BoxModel {
    const _box = new BoxModel();
    _box.id = this.box.id;
    _box.boxModel = this.boxForm.get('boxModel').value;
    _box.nickname = this.boxForm.get('nickName').value;
    _box.type = this.boxForm.get('type').value;
    _box.rangeTraveled = this.boxForm.get('rangeTraveled').value;
    _box.serialNumber = this.boxForm.get('serialNumber').value;
    _box.brand = this.boxForm.get('brand').value;
    _box.price = this.boxForm.get('price').value;
    _box.status = AVIABILITY_STATUS.AVAILABLE;
    _box.tires = this.tires?.prepareTires() || [];
    return _box;
  }

  addBox(_box: BoxModel, withBack: boolean = false) {
    this.loadingSubject.next(true);
    this.store.dispatch(
      new CreateBox({
        box: _box,
      })
    );
    this.store
      .pipe(
        delay(1000),
        select(selectLastCreatedBoxId),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((newId) => {
        if (!newId) {
          return;
        }

        this.loadingSubject.next(false);
        if (withBack) {
          this.goBack(newId);
        } else {
          this.refreshBox(true, newId);
        }
      });
  }

  updateBox(_box: BoxModel, withBack: boolean = false) {
    this.loadingSubject.next(true);

    const updateBox: Update<BoxModel> = {
      id: _box.id,
      changes: _box,
    };

    this.store.dispatch(
      new UpdateBox({
        partialBox: updateBox,
        box: _box,
      })
    );

    of(undefined)
      .pipe(delay(3000), takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        // Remove this line
        if (withBack) {
          this.goBack(_box.id);
        } else {
          this.refreshBox(false);
        }
      }); // Remove this line
  }

  getComponentTitle() {
    let result = this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams);
    if (!this.box || !this.box.id) {
      return result;
    }

    result = this.translate.instant(
      'MODULE.EDIT_ENTITY', this.translateParams
    ) + `- ${this.box.serialNumber} ${this.box.boxModel}, ${this.box.brand}`;
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
    this.boxForm.get('image').setValue(file);
  }
}
