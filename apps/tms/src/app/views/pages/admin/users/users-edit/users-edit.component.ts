import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { CreateUser, UpdateUser } from '@tms/actions/user.actions';
import { ConfirmPasswordValidator } from '@tms/crud';
import { SubheaderService } from '@tms/layout';
import { UserModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectLastCreatedUserId } from '@tms/selectors/user.selectors';
import { UsersService } from '@tms/services';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'b404-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {

  public user: UserModel;
  public userId$: Observable<number>;
  public oldUser: UserModel;
  public selectedTab = 0;
  public loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean>;
  public userForm: FormGroup;
  public hasFormErrors = false;
  public availableYears: number[] = [];
  public filteredColors: Observable<string[]>;
  public filteredManufactures: Observable<string[]>;
  public translateParams: TranslateParams;

  private ngUnsubscribe = new Subject();
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private userFB: FormBuilder,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private translate: CustomTranslateService,
    private activatedRoute: ActivatedRoute,
    private subheaderService: SubheaderService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('ADMIN.USERS.ENTITY'),
      entities: this.translate.instant('ADMIN.USERS.ENTITIES'),
    };
  }

  ngOnInit() {
    this.user = this.activatedRoute.snapshot.data.user as UserModel;
    this.activatedRoute.data.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => {
      this.loadUser(data.user);
    });
  }

  loadUser(_user, fromService: boolean = false) {
    console.log(_user);
    if (!_user) {
      this.goBack('');
    }
    this.user = _user;
    this.userId$ = of(_user.id);
    this.oldUser = Object.assign({}, _user);
    console.log(this.oldUser);
    this.initUser();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }

  // If product didn't find in store
  loadUserFromService(userId) {
    this.userService.getUserById(userId).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.loadUser(res, true);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initUser() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.user.id) {
      this.subheaderService.setBreadcrumbs([{
        title: this.translate.instant('ADMIN.ADMIN'),
        page: `/admin`
      },
      {
        title: this.translate.instant('ADMIN.USERS.ENTITIES.VALUE'),
        page: `/admin/users`
      },
      {
        title: this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams),
        page: `/admin/users/add`
      }
      ]);
      return;
    }

    this.subheaderService.setTitle(this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams));
    this.subheaderService.setBreadcrumbs([{
      title: this.translate.instant('ADMIN.ADMIN'),
      page: `/admin`
    },
    {
      title: this.translate.instant('ADMIN.USERS.ENTITIES.VALUE'),
      page: `/admin/users`
    },
    {
      title: this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams),
      page: `/admin/users/edit`,
      queryParams: {
        id: this.user.id
      }
    }
    ]);
  }

  createForm() {
    if (this.user.id) {
      return this.userForm = this.userFB.group({
        id: [this.user.id],
        email: [this.user.email, Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          Validators.maxLength(320)
        ])],
      });
    } else {
      return this.userForm = this.userFB.group({
        email: [this.user.email, Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          Validators.maxLength(320)
        ])],
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])],
        confirmPassword: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])],
      }, {
        validator: ConfirmPasswordValidator.MatchPassword
      });
    }
  }

  controlHasError(formGroup: FormGroup, controlName: string, validationType: string): boolean {
    const control = formGroup.get(controlName);
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/admin/users?id=${id}`;
    this.router.navigateByUrl(url, {
      relativeTo: this.activatedRoute
    });
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/admin/users', {
      relativeTo: this.activatedRoute
    });
  }

  refreshUser(isNew: boolean = false, id = "") {
    this.loadingSubject.next(false);
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], {
        relativeTo: this.activatedRoute
      });
      return;
    }

    url = `/admin/users`;
    this.router.navigateByUrl(url, {
      relativeTo: this.activatedRoute
    });
  }

  reset() {
    this.user = Object.assign({}, this.oldUser);
    this.createForm();
    this.hasFormErrors = false;
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userForm.updateValueAndValidity();
  }

  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.userForm.controls;
    /** check form */
    if (this.userForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      this.selectedTab = 0;
      return;
    }

    // tslint:disable-next-line:prefer-const
    let editedUser = this.prepareUser();

    if (!!editedUser.id) {
      this.updateUser(editedUser, withBack);
      this.router.navigateByUrl('/admin/users', {
        relativeTo: this.activatedRoute,
      });
      return;
    }

    this.addUser(editedUser, withBack);
  }

  prepareUser(): UserModel {
    const _user = new UserModel();
    _user.id = this.userForm.get('id')?.value || null;
    _user.email = this.userForm.get('email').value;
    _user.password = this.userForm.get('password')?.value || undefined;
    return _user;
  }

  addUser(_user: UserModel, withBack: boolean = false) {
    this.loadingSubject.next(true);
    this.store.dispatch(new CreateUser({
      user: _user
    }));
    this.store.pipe(
      delay(1000),
      select(selectLastCreatedUserId),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(newId => {
      if (!newId) {
        return;
      }

      this.loadingSubject.next(false);
      if (withBack) {
        this.goBack(newId);
      } else {
        this.refreshUser(true, newId);
      }
    });
  }

  updateUser(_user: UserModel, withBack: boolean = false) {
    this.loadingSubject.next(true);

    const updateUser: Update<UserModel> = {
      id: _user.id,
      changes: _user
    };

    this.store.dispatch(new UpdateUser({
      partialUser: updateUser,
      user: _user
    }));

    of(undefined).pipe(
      delay(3000),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => { // Remove this line
      if (withBack) {
        this.goBack(_user.id);
      } else {
        this.refreshUser(false);
      }
    }); // Remove this line
  }

  getComponentTitle() {
    let result = this.translate.instant('MODULE.CREATE_ENTITY', this.translateParams);
    if (!this.user || !this.user.id) {
      return result;
    }

    result = this.translate.instant('MODULE.EDIT_ENTITY', this.translateParams) + ` - ${this.user.email}`;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

}
