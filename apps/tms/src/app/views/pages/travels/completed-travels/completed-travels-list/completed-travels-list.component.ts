import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DeleteManyCompletedTravels, DeleteOneCompletedTravel, RequestCompletedTravelsPage } from '@tms/actions/completed-travel.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { CompletedTravelsDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { TravelModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectCompletedTravelsPageLastQuery } from '@tms/selectors/completed-travel.selectors';
import { CustomTranslateService } from '@tms/translate';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'b404-completed-travels-list',
  templateUrl: './completed-travels-list.component.html',
  styleUrls: ['./completed-travels-list.component.scss']
})
export class CompletedTravelsListComponent implements OnInit {

  dataSource: CompletedTravelsDataSource;
  displayedColumns = ['Select', 'Operator', 'Box', 'Truck', 'LoadTime', 'DownloadTime', 'ArriveTime', 'ArriveCustomerTime', 'Actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<TravelModel>(true, []);
  travelsResult: TravelModel[] = [];

  private ngUnsuscribe = new Subject();
  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private translate: CustomTranslateService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
  ) { }

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadTravelsList()),
        takeUntil(this.ngUnsuscribe)
      )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadTravelsList();
        }),
        takeUntil(this.ngUnsuscribe)
      )
      .subscribe();

    // Set title to page breadCrumbs
    this.subheaderService.setTitle(this.translate.instant('TRAVELS.ENTITIES.VALUE'));

    // Init DataSource
    this.dataSource = new CompletedTravelsDataSource(this.store);
    this.dataSource.entitySubject.pipe(skip(1), distinctUntilChanged(), takeUntil(this.ngUnsuscribe)).subscribe((res) => {
      this.travelsResult = res;
      console.log(this.travelsResult);
    });
    this.store.pipe(select(selectCompletedTravelsPageLastQuery), takeUntil(this.ngUnsuscribe)).subscribe((res) => (this.lastQuery = res));

    // Read from URL itemId, for restore previous state
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id) {
        this.restoreState(this.lastQuery, +params.id);
      }

      // First load
      of(undefined)
        .pipe(delay(1000), takeUntil(this.ngUnsuscribe))
        .subscribe(() => {
          // Remove this line, just loading imitation
          this.loadTravelsList();
        }); // Remove this line, just loading imitation
    });
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  loadTravelsList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(this.filterConfiguration(), this.sort.direction, this.sort.active, this.paginator.pageIndex, this.paginator.pageSize);
    // Call request from server
    this.store.dispatch(new RequestCompletedTravelsPage({ page: queryParams }));
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

  deleteTravel(_item: TravelModel) {
    const title: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_ONE_TITLE');
    const description: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_ONE_DESCRIPTION');
    const deleteMessage: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_ONE_MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.store.dispatch(new DeleteOneCompletedTravel({ id: _item.id }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
    });
  }

  deleteTravels() {
    const title: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_MANY_TITLE');
    const description: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_MANY_DESCRIPTION');
    const deleteMessage: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_MANY_MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      const idsForDeletion: string[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.store.dispatch(new DeleteManyCompletedTravels({ ids: idsForDeletion }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
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
      this.travelsResult.forEach((row) => this.selection.select(row));
    }
  }

}
