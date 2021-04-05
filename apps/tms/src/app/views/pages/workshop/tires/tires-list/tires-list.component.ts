import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DeleteManyTires, DeleteOneTire, RequestTiresPage } from '@tms/actions/tire.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { TiresDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { TireModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTiresPageLastQuery } from '@tms/selectors/tire.selectors';
import { fromEvent, merge, of, Subject, Subscription } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'b404-tires-list',
  templateUrl: './tires-list.component.html',
  styleUrls: ['./tires-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TiresListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: TiresDataSource;
  displayedColumns = ['Select', 'SerialNumber', 'RangeTraveled', 'Status', 'Actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<TireModel>(true, []);
  tiresResult: TireModel[] = [];
  private subscriptions: Subscription[] = [];

  private ngUnsubscribe = new Subject();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private store: Store<AppState>
  ) { }

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
      tap(() => this.loadTiresList()),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadTiresList();
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();


    // Set title to page breadCrumbs
    this.subheaderService.setTitle(this.translate.instant('WORKSHOP.TIRES.TEXT.TIRES'));

    // Init DataSource
    this.dataSource = new TiresDataSource(this.store);
    this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      this.tiresResult = res;
    });
    this.store.pipe(
      select(selectTiresPageLastQuery),
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
        this.loadTiresList();
      }); // Remove this line, just loading imitation
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadTiresList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new RequestTiresPage({ page: queryParams }));
    this.selection.clear();
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterCondition && this.filterCondition.length > 0) {
      filter.condition = +this.filterCondition;
    }
    filter.id = searchText;
    filter.position = searchText;
    filter.serialNumber = searchText;
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

  deleteTire(_item: TireModel) {
    const title = this.translate.instant('WORKSHOP.TIRES.TEXT.DELETE_ONE_TITLE');
    const description = this.translate.instant('WORKSHOP.TIRES.TEXT.DELETE_ONE_DESCRIPTION');
    const deleteMessage = this.translate.instant('WORKSHOP.TIRES.TEXT.DELETE_ONE_MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(res => {
      if (!res) {
        return;
      }

      this.store.dispatch(new DeleteOneTire({ id: _item.id }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
    });
  }

  deleteTires() {
    const title = this.translate.instant('WORKSHOP.TIRES.TEXT.DELETE_MANY_TITLE');
    const description = this.translate.instant('WORKSHOP.TIRES.TEXT.DELETE_MANY_DESCRIPTION');
    const deleteMessage = this.translate.instant('WORKSHOP.TIRES.TEXT.DELETE_MANY_MESSAGE');

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
      this.store.dispatch(new DeleteManyTires({ ids: idsForDeletion }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
      this.selection.clear();
    });
  }

  editTire(id) {
    this.router.navigate(['../tires/edit', id], { relativeTo: this.activatedRoute });
  }

  createTire() {
    this.router.navigateByUrl('/workshop/tires/add');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tiresResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.tiresResult.forEach(row => this.selection.select(row));
    }
  }
}
