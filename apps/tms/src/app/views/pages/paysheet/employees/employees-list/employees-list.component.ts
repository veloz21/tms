import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from '@bits404/api-interfaces';
import { select, Store } from '@ngrx/store';
import { DeleteManyEmployees, DeleteOneEmployee, RequestEmployeePage, ViewEmployee } from '@tms/actions/employee.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { EmployeesDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { EmployeeModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectEmployeesPageLastQuery } from '@tms/selectors/employee.selectors';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'b404-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: EmployeesDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<EmployeeModel>(true, []);
  employeesResult: EmployeeModel[] = [];

  public get displayedColumns() {
    const cols = ['Name', 'Type', 'Cellphone', 'DriversLicense','Status', 'Actions'];
    if (this.isDesktop) {
      cols.unshift('Select');
    }
    return cols;
  };

  public get isDesktop() {
    return this.windowWidth > 1024;
  }

  public windowWidth = 0;

  protected STATUS = Status;
  public translateParams: TranslateParams;

  private ngUnsuscribe = new Subject();
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private translate: CustomTranslateService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('PAYSHEET.EMPLOYEE.ENTITY'),
      entities: this.translate.instant('PAYSHEET.EMPLOYEE.ENTITIES'),
    };
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.pipe(takeUntil(this.ngUnsuscribe)).subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadEmployeesList()),
      takeUntil(this.ngUnsuscribe)
    )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadEmployeesList();
      }),
      takeUntil(this.ngUnsuscribe)
    )
      .subscribe();

    // Set title to page breadCrumbs
    this.subheaderService.setTitle(this.translate.instant('PAYSHEET.EMPLOYEE.ENTITIES.VALUE'));

    // Init DataSource
    this.dataSource = new EmployeesDataSource(this.store);
    this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged(),
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => {
      this.employeesResult = res;
    });
    this.store.pipe(select(selectEmployeesPageLastQuery), takeUntil(this.ngUnsuscribe)).subscribe(res => this.lastQuery = res);

    // Read from URL itemId, for restore previous state
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsuscribe)).subscribe(params => {
      if (params.id) {
        this.restoreState(this.lastQuery, +params.id);
      }

      // First load
      of(undefined).pipe(delay(1000), takeUntil(this.ngUnsuscribe)).subscribe(() => { // Remove this line, just loading imitation
        this.loadEmployeesList();
      }); // Remove this line, just loading imitation
    });
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  loadEmployeesList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    console.log(queryParams);
    this.store.dispatch(new RequestEmployeePage({ page: queryParams }));
    this.selection.clear();
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    filter.firstName = searchText;
    filter.lastName = searchText;
    filter.job = searchText;
    filter.birthDate = searchText;
    filter.RFC = searchText;
    filter.CURP = searchText;
    filter.NSS = searchText;
    filter.salary = searchText;
    filter.cellphone = searchText;
    filter.address = searchText;
    filter.driversLicense = searchText;
    filter.licenseType = searchText;
    filter.dueDate = searchText;
    return filter;
  }

  restoreState(queryParams: QueryParamsModel, id: number) {

    if (!queryParams.filter) {
      return;
    }

    if (queryParams.filter.model) {
      this.searchInput.nativeElement.value = queryParams.filter.model;
    }
  }

  deleteEmployee(_item: EmployeeModel) {
    const title: string = this.translate.instant('MODULE.DELETE_ONE_TITLE', this.translateParams);
    const description: string = this.translate.instant('MODULE.DELETE_ONE_DESCRIPTION', this.translateParams);
    const deleteMessage: string = this.translate.instant('MODULE.DELETE_ONE_MESSAGE', this.translateParams);

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsuscribe)).subscribe(res => {
      if (!res) {
        return;
      }

      this.store.dispatch(new DeleteOneEmployee({ id: _item.id }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
    });
  }

  deleteEmployees() {
    const title: string = this.translate.instant('MODULE.DELETE_MANY_TITLE', this.translateParams);
    const description: string = this.translate.instant('MODULE.DELETE_MANY_DESCRIPTION', this.translateParams);
    const deleteMessage: string = this.translate.instant('MODULE.DELETE_MANY_MESSAGE', this.translateParams);

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsuscribe)).subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: string[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.store.dispatch(new DeleteManyEmployees({ ids: idsForDeletion }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
      this.selection.clear();
    });
  }

  editEmployee(id) {
    this.router.navigate(['../employees/edit', id], { relativeTo: this.activatedRoute });
  }

  createEmployee() {
    this.router.navigateByUrl('/ecommerce/employees/add');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.employeesResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.employeesResult.forEach(row => this.selection.select(row));
    }
  }

  viewEmployee(id: string) {
    this.store.dispatch(new ViewEmployee({ id }));
  }
}
