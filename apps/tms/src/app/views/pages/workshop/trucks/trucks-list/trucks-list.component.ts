import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Status } from '@bits404/api-interfaces';
import { select, Store } from '@ngrx/store';
import { DeleteManyTrucks, DeleteOneTruck, RequestTrucksPage, ViewTruck } from '@tms/actions/truck.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { TrucksDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { TruckModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTrucksPageLastQuery } from '@tms/selectors/trucks.selectors';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'b404-trucks-list',
  templateUrl: './trucks-list.component.html',
  styleUrls: ['./trucks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrucksListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: TrucksDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<TruckModel>(true, []);
  trucksResult: TruckModel[] = [];

  public get displayedColumns() {
    const cols = ['Model', 'Brand', 'SerialNumber', 'MotorNumber', 'MaintenancePeriod', 'InicialMilage', 'Milage', 'Status', 'Actions'];
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
    public dialog: MatDialog,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private translate: CustomTranslateService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('WORKSHOP.TRUCK.ENTITY'),
      entities: this.translate.instant('WORKSHOP.TRUCK.ENTITIES'),
    };
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange
      .pipe(takeUntil(this.ngUnsuscribe))
      .subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadTrucksList()),
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
          this.loadTrucksList();
        }),
        takeUntil(this.ngUnsuscribe)
      )
      .subscribe();

    // Set title to page breadCrumbs
    this.subheaderService.setTitle(
      this.translate.instant('WORKSHOP.TRUCK.ENTITIES.VALUE')
    );

    // Init DataSource
    this.dataSource = new TrucksDataSource(this.store);
    this.dataSource.entitySubject
      .pipe(skip(1), distinctUntilChanged(), takeUntil(this.ngUnsuscribe))
      .subscribe((res) => {
        this.trucksResult = res;
      });

    this.store
      .pipe(select(selectTrucksPageLastQuery), takeUntil(this.ngUnsuscribe))
      .subscribe((res) => (this.lastQuery = res));

    // Read from URL itemId, for restore previous state
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsuscribe))
      .subscribe((params) => {
        if (params.id) {
          this.restoreState(this.lastQuery, params.id);
        }

        // First load
        of(undefined)
          .pipe(delay(1000), takeUntil(this.ngUnsuscribe))
          .subscribe(() => {
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

  deleteTruck(_item: TruckModel) {
    const title: string = this.translate.instant('MODULE.DELETE_ONE_TITLE', this.translateParams);
    const description: string = this.translate.instant('MODULE.DELETE_ONE_DESCRIPTION', this.translateParams);
    const deleteMessage: string = this.translate.instant('MODULE.DELETE_ONE_MESSAGE', this.translateParams);

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsuscribe))
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.store.dispatch(new DeleteOneTruck({ id: _item.id }));
        this.layoutUtilsService.showActionNotification(
          deleteMessage,
          MessageType.Delete
        );
      });
  }

  deleteTrucks() {
    const title: string = this.translate.instant('MODULE.DELETE_MANY_TITLE', this.translateParams);
    const description: string = this.translate.instant('MODULE.DELETE_MANY_DESCRIPTION', this.translateParams);
    const deleteMessage: string = this.translate.instant('MODULE.DELETE_MANY_MESSAGE', this.translateParams);

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsuscribe))
      .subscribe((res) => {
        if (!res) {
          return;
        }

        const idsForDeletion: string[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.selection.selected.length; i++) {
          idsForDeletion.push(this.selection.selected[i].id);
        }
        this.store.dispatch(new DeleteManyTrucks({ ids: idsForDeletion }));
        this.layoutUtilsService.showActionNotification(
          deleteMessage,
          MessageType.Delete
        );
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
      this.trucksResult.forEach((row) => this.selection.select(row));
    }
  }

  viewTruck(id: string) {
    this.store.dispatch(new ViewTruck({ id }));
  }
}
