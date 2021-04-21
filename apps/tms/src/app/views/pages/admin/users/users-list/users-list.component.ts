import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DeleteManyUsers, DeleteOneUser, RequestUsersPage, ViewUser } from '@tms/actions/user.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { UsersDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { UserModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectUsersPageLastQuery } from '@tms/selectors/user.selectors';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';


@Component({
  selector: 'b404-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  // Table fields
  dataSource: UsersDataSource;
  displayedColumns = ['Select', 'Email', 'LastLogin', 'Actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<UserModel>(true, []);
  usersResult: UserModel[] = [];
  public translateParams: TranslateParams;

  private ngUnsubscribe = new Subject();
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
      entity: this.translate.instant('ADMIN.USERS.ENTITY'),
      entities: this.translate.instant('ADMIN.USERS.ENTITIES'),
    };
  }

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.pipe(
      takeUntil(this.ngUnsubscribe),
    ).subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadUsersList()),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadUsersList();
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();


    // Set title to page breadCrumbs
    this.subheaderService.setTitle(this.translate.instant('ADMIN.USERS.ENTITIES.VALUE'));

    // Init DataSource
    this.dataSource = new UsersDataSource(this.store);
    this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.usersResult = res;
    });
    this.store.pipe(
      select(selectUsersPageLastQuery),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => this.lastQuery = res);
    // Load last query from store

    // Read from URL itemId, for restore previous state
    const routeSubscription = this.activatedRoute.queryParams.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(params => {
      if (params.id) {
        this.restoreState(this.lastQuery, +params.id);
      }

      // First load
      of(undefined).pipe(
        delay(1000),
        takeUntil(this.ngUnsubscribe)
      ).subscribe(() => { // Remove this line, just loading imitation
        this.loadUsersList();
      }); // Remove this line, just loading imitation
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadUsersList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new RequestUsersPage({ page: queryParams }));
    this.selection.clear();
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterCondition && this.filterCondition.length > 0) {
      filter.condition = +this.filterCondition;
    }
    filter.email = searchText;
    return filter;
  }

  restoreState(queryParams: QueryParamsModel, id: number) {

    if (!queryParams.filter) {
      return;
    }

    if ('condition' in queryParams.filter) {
      this.filterCondition = queryParams.filter.condition.toString();
    }

    if (queryParams.filter.model) {
      this.searchInput.nativeElement.value = queryParams.filter.model;
    }
  }

  deleteUser(_item: UserModel) {
    const title = this.translate.instant('MODULE.DELETE_ONE_TITLE', this.translateParams);
    const description = this.translate.instant('MODULE.DELETE_ONE_DESCRIPTION', this.translateParams);
    const deleteMessage = this.translate.instant('MODULE.DELETE_ONE_MESSAGE', this.translateParams);

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      if (!res) {
        return;
      }

      this.store.dispatch(new DeleteOneUser({ id: _item.id }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
    });
  }

  deleteUsers() {
    const title = this.translate.instant('MODULE.DELETE_MANY_TITLE', this.translateParams);
    const description = this.translate.instant('MODULE.DELETE_MANY_DESCRIPTION', this.translateParams);
    const deleteMessage = this.translate.instant('MODULE.DELETE_MANY_MESSAGE', this.translateParams);

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: string[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.store.dispatch(new DeleteManyUsers({ ids: idsForDeletion }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
      this.selection.clear();
    });
  }

  editUser(id) {
    this.router.navigate(['../users/edit', id], { relativeTo: this.activatedRoute });
  }

  createUser() {
    this.router.navigateByUrl('/admin/users/add');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.usersResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.usersResult.forEach(row => this.selection.select(row));
    }
  }

  viewUser(id: string) {
    this.store.dispatch(new ViewUser({ id }));
  }

}
