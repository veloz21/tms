import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DeleteManyTrucks, DeleteOneTruck, RequestTrucksPage } from '@tms/actions/truck.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { TrucksDataSource } from '@tms/data-sources';
import { Truck } from '@tms/interfaces';
import { SubheaderService } from '@tms/layout';
import { AppState } from '@tms/reducers';
import { selectTrucksPageLastQuery } from '@tms/selectors/trucks.selectors';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'b404-trucks-list',
  templateUrl: './trucks-list.component.html',
  styleUrls: ['./trucks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrucksListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: TrucksDataSource;
  displayedColumns = ['Select', 'Model', 'Brand', 'SerialNumber', 'MotorNumber', 'MaintenancePeriod', 'InicialMilage', 'Milage', 'Status', 'Actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<Truck>(true, []);
  trucksResult: Truck[] = [];
  private ngUnsuscribe = new Subject();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.pipe(
      takeUntil(this.ngUnsuscribe)
    ).subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadTrucksList()),
      takeUntil(this.ngUnsuscribe)
    ).subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadTrucksList();
      }),
      takeUntil(this.ngUnsuscribe)
    )
      .subscribe();

    // Set title to page breadCrumbs
    this.subheaderService.setTitle(this.translate.instant('WORKSHOP.TRUCK.TEXT.TRUCK'));

    // Init DataSource
    this.dataSource = new TrucksDataSource(this.store);
    this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged(),
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => {
      this.trucksResult = res;
    });

    this.store.pipe(
      select(selectTrucksPageLastQuery),
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => this.lastQuery = res);

    // Read from URL itemId, for restore previous state
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.ngUnsuscribe)
    ).subscribe(params => {
      if (params.id) {
        this.restoreState(this.lastQuery, params.id);
      }

      // First load
      of(undefined).pipe(delay(1000), takeUntil(this.ngUnsuscribe)).subscribe(() => {
        this.loadTrucksList();
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  loadTrucksList() {
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
    this.store.dispatch(new RequestTrucksPage({ page: queryParams }));
    this.selection.clear();
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    filter.model = searchText;
    filter.brand = searchText;
    filter.serialNumber = searchText;
    filter.motorNumber = searchText;
    filter.maintenancePeriod = searchText;
    filter.inicialMilage = searchText;
    filter.milage = searchText;
    filter.circulationCard = searchText;
    filter.airbag = searchText;
    filter.dock = searchText;
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

  deleteTruck(_item: Truck) {
    const _title: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.DELETE_ONE_TITLE');
    const _description: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.DELETE_ONE_DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.DELETE_ONE_WAIT');
    const _deleteMessage: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.DELETE_ONE_MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().pipe(
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => {
      if (!res) {
        return;
      }

      this.store.dispatch(new DeleteOneTruck({ id: _item.id }));
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  }

  deleteTrucks() {
    const _title: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.DELETE_MANY_TITLE');
    const _description: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.DELETE_MANY_DESCRIPTION');
    const _waitDesciption: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.DELETE_MANY_WAIT');
    const _deleteMessage: string = this.translate.instant('WORKSHOP.TRUCK.TEXT.DELETE_MANY_MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().pipe(
      takeUntil(this.ngUnsuscribe)
    ).subscribe(res => {
      if (!res) {
        return;
      }

      const idsForDeletion: number[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.selection.selected.length; i++) {
        idsForDeletion.push(this.selection.selected[i].id);
      }
      this.store.dispatch(new DeleteManyTrucks({ ids: idsForDeletion }));
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
      this.selection.clear();
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.trucksResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.trucksResult.forEach(row => this.selection.select(row));
    }
  }
}
