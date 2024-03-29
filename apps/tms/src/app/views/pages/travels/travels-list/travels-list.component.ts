import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { select, Store } from '@ngrx/store';
import { ViewBox } from '@tms/actions/box.actions';
import { CreateCompletedTravel } from '@tms/actions/completed-travel.actions';
import { ViewEmployee } from '@tms/actions/employee.actions';
import { DeleteManyTravels, DeleteOneTravel, RequestTravelsPage, UpdateTravelStatus, ViewTravel } from '@tms/actions/travel.actions';
import { ViewTruck } from '@tms/actions/truck.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { TravelsDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { TravelModel, TravelStatusModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTravelsPageLastQuery } from '@tms/selectors/travel.selectors';
import { CustomTranslateService, TranslateParams } from '@tms/translate';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'b404-travels-list',
  templateUrl: './travels-list.component.html',
  styleUrls: ['./travels-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravelsListComponent implements OnInit, OnDestroy {
  // Table fields
  showed: boolean;
  dataSource: TravelsDataSource;
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

  public get displayedColumns() {
    const cols = ['Operator', 'Box', 'Truck', 'StatusTime', 'Status', 'Actions'];
    if (this.isDesktop) {
      cols.unshift('Select');
    }
    return cols;
  };

  public get isDesktop() {
    return this.windowWidth > 1024;
  }

  public windowWidth = 0;
  public translateParams: TranslateParams;
  public completedTravelTranslateParams: TranslateParams;

  private ngUnsuscribe = new Subject();
  constructor(
    public dialog: MatDialog,
    private store: Store<AppState>,
    private translate: CustomTranslateService,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
    this.translateParams = {
      entity: this.translate.instant('TRAVELS.ENTITY'),
      entities: this.translate.instant('TRAVELS.ENTITIES'),
    };
    this.completedTravelTranslateParams = {
      entity: this.translate.instant('COMPLETED_TRAVELS.ENTITY'),
      entities: this.translate.instant('COMPLETED_TRAVELS.ENTITIES'),
    };
  }

  ngOnInit() {
    this.showed = false;
    this.windowWidth = window.innerWidth;
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
    this.dataSource = new TravelsDataSource(this.store);
    this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged(),
      takeUntil(this.ngUnsuscribe)
    ).subscribe((res) => {
      this.travelsResult = res;
    });
    this.store.pipe(select(selectTravelsPageLastQuery), takeUntil(this.ngUnsuscribe)).subscribe((res) => {
      this.lastQuery = res;
    });
    this.loadTravelsList();
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }

  loadTravelsList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(this.filterConfiguration(), this.sort.direction, this.sort.active, this.paginator.pageIndex, this.paginator.pageSize);
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

  deleteTravel(_item: TravelModel) {
    const title: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_ONE_TITLE');
    const description: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_ONE_DESCRIPTION');
    const deleteMessage: string = this.translate.instant('TRAVELS.TRAVEL.TEXT.DELETE_ONE_MESSAGE');

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.store.dispatch(new DeleteOneTravel({ id: _item.id }));
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
      this.store.dispatch(new DeleteManyTravels({ ids: idsForDeletion }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
      this.selection.clear();
    });
  }

  doneTravel(travel: TravelModel) {
    const title: string = this.translate.instant('Terminar viaje');
    const description: string = this.translate.instant('¿Estas seguro de que quieres terminar este viaje?');
    const deleteMessage: string = this.translate.instant('Viaje Terminado');

    const dialogRef = this.layoutUtilsService.deleteElement({ title, description });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      console.log(travel);
      this.store.dispatch(new CreateCompletedTravel({ completedTravel: travel }));
      this.store.dispatch(new DeleteOneTravel({ id: travel.id }));
      this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete);
      console.log('si termine');
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

  updateStatus(travel: TravelModel) {
    const currentStatusIndex = travel.status.findIndex(s => s.id === travel.currentStatus);
    const nextStatus = travel.status[currentStatusIndex + 1];
    const status = new TravelStatusModel({
      ...nextStatus,
      date: new Date(),
      comments: '',
    });

    const dialogRef = this.layoutUtilsService.travelStatus(status);
    dialogRef.afterClosed().subscribe((validatedStatus: TravelStatusModel | null) => {
      if (!validatedStatus) {
        return;
      }

      this.store.dispatch(new UpdateTravelStatus({ travelId: travel.id, status: validatedStatus }));
    });

  }

  viewBox(id: string) {
    this.store.dispatch(new ViewBox({ id }));
  }

  viewTruck(id: string) {
    this.store.dispatch(new ViewTruck({ id }));
  }

  viewOperator(id: string) {
    this.store.dispatch(new ViewEmployee({ id }));
  }

  viewTravel(id: string) {
    this.store.dispatch(new ViewTravel({ id }));
  }
}
