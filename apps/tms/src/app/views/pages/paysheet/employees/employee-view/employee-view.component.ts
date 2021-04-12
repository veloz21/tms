import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { CreateEmployee, UpdateEmployee } from '../../../../../core/actions/employee.actions';
import { AVIABILITY_STATUS } from '../../../../../core/enums';
import { EmployeeModel } from '../../../../../core/models';
import { AppState } from '../../../../../core/reducers';
import { selectLastCreatedEmployeeId } from '../../../../../core/selectors/employee.selectors';
import { SubheaderService } from '../../../../../core/_base/layout';

@Component({
  selector: 'b404-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss']
})
export class EmployeeViewComponent implements OnInit {

  // Public properties
  employee: EmployeeModel;
  employeeId$: Observable<string>;
  oldEmployee: EmployeeModel;
  selectedTab = 0;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  employeeForm: FormGroup;
  hasFormErrors = false;
  availableYears: number[] = [];

  imageUrl: string;
  imageFile: File;

  private ngUnsuscribe = new Subject();
  constructor(private store: Store<AppState>, private activatedRoute: ActivatedRoute, private router: Router, private employeeFB: FormBuilder, public dialog: MatDialog, private translate: TranslateService, private subheaderService: SubheaderService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.activatedRoute.data.pipe(takeUntil(this.ngUnsuscribe)).subscribe((data) => {
      this.loadEmployee(data.employee as EmployeeModel);
    });
  }

  loadEmployee(_employee: EmployeeModel, fromService: boolean = false) {
    if (!_employee) {
      this.goBack('');
    }
    this.employee = _employee;
    this.employeeId$ = of(_employee.id);
    this.oldEmployee = Object.assign({}, _employee);
    this.initEmployee();
    if (fromService) {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  initEmployee() {
    this.createForm();
    this.loadingSubject.next(false);
    if (!this.employee.id) {
      this.subheaderService.setBreadcrumbs([
        { title: this.translate.instant('PAYSHEET.PAYSHEET'), page: `/paysheet` },
        { title: this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.EMPLOYEE'), page: `/paysheet/employees` },
        { title: this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.CREATE_EMPLOYEE'), page: `/paysheet/employees/add` },
      ]);
      return;
    }
    this.subheaderService.setTitle(this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.EDIT_EMPLOYEE'));
    this.subheaderService.setBreadcrumbs([
      { title: this.translate.instant('PAYSHEET.PAYSHEET'), page: `/paysheet` },
      { title: this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.EMPLOYEE'), page: `/paysheet/employees` },
      { title: this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.EDIT_EMPLOYEE'), page: `/paysheet/employees/edit`, queryParams: { id: this.employee.id } },
    ]);
  }

  createForm() {
    this.employeeForm = this.employeeFB.group({
      firstName: [this.employee.firstName, [Validators.required]],
      lastName: [this.employee.lastName, [Validators.required]],
      cellphone: [this.employee.cellphone, [Validators.required]],
      secondaryCellphone: [this.employee.secondaryCellphone],
      address: [this.employee.address, [Validators.required]],
      birthDate: [this.employee.birthDate, [Validators.nullValidator]],
      type: [this.employee.type],
      admissionDate: [this.employee.admissionDate, [Validators.nullValidator]],
      salary_total: [this.employee.salary.total, [Validators.required]],
      licenseType: [this.employee.documents.driversLicense.type],
      licensedueDate: [this.employee.documents.driversLicense.dueDate],
      licenseAttchment: [],
      testDate: [this.employee.documents.psychophysicistTest.date],
      testExpirationDate: [this.employee.documents.psychophysicistTest.expirationDate],
      testAttachment: [],
      ine: [this.employee.documents.ine.attachmentPath],
      image: [],
    });
  }

  goBack(id) {
    this.loadingSubject.next(false);
    const url = `/paysheet/employees?id=${id}`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  goBackWithoutId() {
    this.router.navigateByUrl('/paysheet/employees', { relativeTo: this.activatedRoute });
  }

  refreshEmployee(isNew: boolean = false, id?: string) {
    this.loadingSubject.next(false);
    let url = this.router.url;
    if (!isNew) {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
      return;
    }

    url = `/paysheet/employees`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  reset() {
    this.employee = Object.assign({}, this.oldEmployee);
    this.createForm();
    this.hasFormErrors = false;
    this.employeeForm.markAsPristine();
    this.employeeForm.markAsUntouched();
    this.employeeForm.updateValueAndValidity();
  }

  onSumbit(withBack: boolean = false) {
    this.hasFormErrors = false;
    const controls = this.employeeForm.controls;
    if (this.employeeForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      this.hasFormErrors = true;
      this.selectedTab = 0;
      console.log(this.employeeForm);
      return;
    }

    const editedEmployee = this.prepareEmployee();
    if (!!editedEmployee.id) {
      this.updateEmployee(editedEmployee, withBack);
      return;
    }

    this.addEmployee(editedEmployee, withBack);
  }

  prepareEmployee(): EmployeeModel {
    const _employee = new EmployeeModel();
    _employee.id = this.employee.id;
    _employee.firstName = this.employeeForm.get('firstName').value;
    _employee.lastName = this.employeeForm.get('lastName').value;
    _employee.cellphone = this.employeeForm.get('cellphone').value;
    _employee.type = this.employeeForm.get('type').value;
    _employee.secondaryCellphone = this.employeeForm.get('secondaryCellphone').value;
    _employee.address = this.employeeForm.get('address').value;
    _employee.birthDate = this.employeeForm.get('birthDate').value;
    _employee.admissionDate = this.employeeForm.get('admissionDate').value;
    _employee.salary = {
      currency: 'MXN',
      total: this.employeeForm.get('salary_total').value,
    };
    _employee.documents = {
      driversLicense: {
        type: this.employeeForm.get('licenseType').value,
        dueDate: this.employeeForm.get('licensedueDate').value,
        attachmentPath: this.employeeForm.get('licenseAttchment').value,
      },
      psychophysicistTest: {
        date: this.employeeForm.get('testDate').value,
        expirationDate: this.employeeForm.get('testExpirationDate').value,
        attachmentPath: this.employeeForm.get('testAttachment').value,
      },
      ine: {
        attachmentPath: this.employeeForm.get('ine').value,
      },
    };
    _employee.imagePath = this.employeeForm.get('image').value;
    _employee.status = AVIABILITY_STATUS.AVAILABLE;

    return _employee;
  }

  addEmployee(employee: EmployeeModel, withBack: boolean = false) {
    this.loadingSubject.next(true);
    this.store.dispatch(new CreateEmployee({ employee }));
    this.store.pipe(delay(1000), select(selectLastCreatedEmployeeId), takeUntil(this.ngUnsuscribe)).subscribe((newId) => {
      if (!newId) {
        return;
      }

      this.loadingSubject.next(false);
      if (withBack) {
        this.goBack(newId);
      } else {
        this.refreshEmployee(true, newId);
      }
    });
  }

  updateEmployee(_employee: EmployeeModel, withBack: boolean = false) {
    this.loadingSubject.next(true);

    const updateEmployee: Update<EmployeeModel> = {
      id: _employee.id,
      changes: _employee,
    };

    this.store.dispatch(
      new UpdateEmployee({
        partialEmployee: updateEmployee,
        employee: _employee,
      })
    );

    of(undefined)
      .pipe(delay(3000), takeUntil(this.ngUnsuscribe))
      .subscribe(() => {
        // Remove this line
        if (withBack) {
          this.goBack(_employee.id);
        } else {
          this.refreshEmployee(false);
        }
      });
  }

  getComponentTitle() {
    let result: string = this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.CREATE_TITLE');
    if (!this.employee || !this.employee.id) {
      return result;
    }

    result = this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.EDIT_EMPLOYEE') + ` - ${this.employee.firstName} ${this.employee.lastName} ${this.employee.birthDate}`;
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
    this.employeeForm.get('image').setValue(file);
  }

}
