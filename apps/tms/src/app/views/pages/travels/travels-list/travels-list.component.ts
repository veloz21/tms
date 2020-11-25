import { DeleteManyTravels, DeleteOneTravel, RequestTravelsPage } from '@actions/travel.actions';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@crud';
import { TravelsDataSource } from '@data-sources';
import { Travel } from '@interfaces';
import { SubheaderService } from '@layout';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@reducers';
import { selectTravelsPageLastQuery } from '@selectors/travel.selectors';
import { fromEvent, merge, of, Subject, Subscription } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'b404-travel-list',
  templateUrl: './travels-list.component.html',
  styleUrls: ['./travels-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelsListComponent implements OnInit, OnDestroy {
  // Table fields
  hola: string;
  dataSource: TravelsDataSource;
  displayedColumns = ['Select', 'Operator', 'Box', 'Truck',  'Comments', 'LoadTime', 'DownloadTime', 'ArriveTime', 'ArriveCustomerTime', 'Actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<Travel>(true, []);
  travelsResult: Travel[] = [];
  private subscriptions: Subscription[] = [];
  private ngUnsuscribe = new Subject();

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.hola = 'travel list';
    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadTravelsList()),
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
        this.loadTravelsList();
      }),
      takeUntil(this.ngUnsuscribe)
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Set title to page breadCrumbs
    this.subheaderService.setTitle(this.translate.instant('TRAVEL.TRAVEL.TEXT.TRAVEL'));

    // Init DataSource
    this.dataSource = new TravelsDataSource(this.store);
    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged(),
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => {
      this.travelsResult = res;
      console.log(this.travelsResult);
    });
    this.subscriptions.push(entitiesSubscription);
    const lastQuerySubscription = this.store.pipe(
      select(selectTravelsPageLastQuery),
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => this.lastQuery = res);
    // Load last query from store
    this.subscriptions.push(lastQuerySubscription);

    // Read from URL itemId, for restore previous state
    const routeSubscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.restoreState(this.lastQuery, +params.id);
      }

      // First load
      of(undefined).pipe(delay(1000), takeUntil(this.ngUnsuscribe)).subscribe(() => { // Remove this line, just loading imitation
        this.loadTravelsList();
      }); // Remove this line, just loading imitation
    });
    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());

    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  loadTravelsList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new RequestTravelsPage({ page: queryParams }));
    this.selection.clear();
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;


    if (this.filterStatus && this.filterStatus.length > 0) {
      filter.status = +this.filterStatus;
    }

    if (this.filterCondition && this.filterCondition.length > 0) {
      filter.condition = +this.filterCondition;
    }

    filter.operator = searchText;
    filter.box = searchText;
    filter.trucks = searchText;
    filter.origin = searchText;
    filter.destination = searchText;
    filter.comments = searchText;
    filter.loadTime = searchText;
    filter.downloadTime = searchText;
    filter.arriveTime = searchText;
    filter.arriveCustomerTime = searchText;
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

  deleteTravel(_item: Travel) {
    const _title: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.DELETE_ONE_TITLE');
    const _description: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.DELETE_ONE_DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.DELETE_ONE_WAIT');
    const _deleteMessage: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.DELETE_ONE_MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.store.dispatch(new DeleteOneTravel({ id: _item.id }));
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  }

  deleteTravels() {
    const _title: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.DELETE_MANY_TITLE');
    const _description: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.DELETE_MANY_DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.DELETE_MANY_WAIT');
    const _deleteMessage: string = this.translate.instant('TRAVEL.TRAVEL.TEXT.DELETE_MANY_MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: number[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.store.dispatch(new DeleteManyTravels({ ids: idsForDeletion }));
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      this.selection.clear();
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.travelsResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.travelsResult.forEach(row => this.selection.select(row));
    }
  }
}
