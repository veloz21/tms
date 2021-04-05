import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DeleteManyEmployees, DeleteOneEmployee, RequestEmployeePage } from '@tms/actions/employee.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { EmployeesDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { EmployeeModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectEmployeesPageLastQuery } from '@tms/selectors/employee.selectors';
import { fromEvent, merge, of, Subject, Subscription } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'b404-s-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: EmployeesDataSource;
  displayedColumns = ['Select', 'FirstName', 'LastName', 'BirthDate', 'Salary', 'Cellphone', 'Status', 'Actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<EmployeeModel>(true, []);
  employeesResult: EmployeeModel[] = [];
  private subscriptions: Subscription[] = [];
  private ngUnsuscribe = new Subject();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.pipe(takeUntil(this.ngUnsuscribe)).subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadEmployeesList()),
      takeUntil(this.ngUnsuscribe)
    )
      .subscribe();
    this.subscriptions.push(paginatorSubscriptions);

    // Filtration, bind to searchInput
    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadEmployeesList();
      }),
      takeUntil(this.ngUnsuscribe)
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Set title to page breadCrumbs
    this.subheaderService.setTitle(this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.EMPLOYEE'));

    // Init DataSource
    this.dataSource = new EmployeesDataSource(this.store);
    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged(),
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => {
      this.employeesResult = res;
    });
    this.subscriptions.push(entitiesSubscription);
    const lastQuerySubscription = this.store.pipe(select(selectEmployeesPageLastQuery), takeUntil(this.ngUnsuscribe)).subscribe(res => this.lastQuery = res);
    // Load last query from store
    this.subscriptions.push(lastQuerySubscription);

    // Read from URL itemId, for restore previous state
    const routeSubscription = this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsuscribe)).subscribe(params => {
      if (params.id) {
        this.restoreState(this.lastQuery, +params.id);
      }

      // First load
      of(undefined).pipe(delay(1000), takeUntil(this.ngUnsuscribe)).subscribe(() => { // Remove this line, just loading imitation
        this.loadEmployeesList();
      }); // Remove this line, just loading imitation
    });
    this.subscriptions.push(routeSubscription);
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
    const title: string = this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.DELETE_ONE_TITLE');
    const description: string = this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.DELETE_ONE_DESCRIPTION');
    const deleteMessage: string = this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.DELETE_ONE_MESSAGE');

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
    const title: string = this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.DELETE_MANY_TITLE');
    const description: string = this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.DELETE_MANY_DESCRIPTION');
    const deleteMessage: string = this.translate.instant('PAYSHEET.EMPLOYEE.TEXT.DELETE_MANY_MESSAGE');

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
}
