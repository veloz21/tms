import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteManyBoxes,
  DeleteOneBox,
  RequestBoxesPage,
} from '@tms/actions/box.actions';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '@tms/crud';
import { BoxesDataSource } from '@tms/data-sources';
import { SubheaderService } from '@tms/layout';
import { BoxModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectBoxesPageLastQuery } from '@tms/selectors/boxes.selectors';
import { fromEvent, merge, of, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  skip,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'b404-boxes-list',
  templateUrl: './boxes-list.component.html',
  styleUrls: ['./boxes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesListComponent implements OnInit, OnDestroy {
  // Table fields
  dataSource: BoxesDataSource;
  displayedColumns = [
    'Select',
    'Model',
    'Type',
    'Km',
    'SerialNumber',
    'Brand',
    'Status',
    'Actions',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<BoxModel>(true, []);
  boxesResult: BoxModel[] = [];
  private ngUnsubscribe = new Subject();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadBoxesList()),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Filtration, bind to searchInput
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadBoxesList();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Set title to page breadCrumbs
    this.subheaderService.setTitle(
      this.translate.instant('WORKSHOP.BOXES.TEXT.BOXES')
    );

    // Init DataSource
    this.dataSource = new BoxesDataSource(this.store);
    this.dataSource.entitySubject
      .pipe(skip(1), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.boxesResult = res;
      });
    this.store
      .pipe(select(selectBoxesPageLastQuery))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => (this.lastQuery = res));
    // Load last query from store

    // Read from URL itemId, for restore previous state
    const routeSubscription = this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        // First load
        of(undefined)
          .pipe(delay(1000), takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            // Remove this line, just loading imitation
            this.loadBoxesList();
          }); // Remove this line, just loading imitation
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadBoxesList() {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
    this.store.dispatch(new RequestBoxesPage({ page: queryParams }));
    this.selection.clear();
  }

  filterConfiguration(): any {
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;

    if (this.filterCondition && this.filterCondition.length > 0) {
      filter.condition = +this.filterCondition;
    }
    filter.id = searchText;
    filter.model = searchText;
    filter.type = searchText;
    filter.km = searchText;
    filter.serialNumber = searchText;
    filter.brand = searchText;

    return filter;
  }

  deleteBox(_item: BoxModel) {
    const _title = this.translate.instant(
      'WORKSHOP.BOXES.TEXT.DELETE_ONE_TITLE'
    );
    const _description = this.translate.instant(
      'WORKSHOP.BOXES.TEXT.DELETE_ONE_DESCRIPTION'
    );
    const _waitDesciption = this.translate.instant(
      'WORKSHOP.BOXES.TEXT.DELETE_ONE_WAIT'
    );
    const _deleteMessage = this.translate.instant(
      'WORKSHOP.BOXES.TEXT.DELETE_ONE_MESSAGE'
    );

    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.store.dispatch(new DeleteOneBox({ id: _item.id }));
        this.layoutUtilsService.showActionNotification(
          _deleteMessage,
          MessageType.Delete
        );
      });
  }

  deleteBoxes() {
    const _title = this.translate.instant(
      'WORKSHOP.BOXES.TEXT.DELETE_MANY_TITLE'
    );
    const _description = this.translate.instant(
      'WORKSHOP.BOXES.TEXT.DELETE_MANY_DESCRIPTION'
    );
    const _waitDesciption = this.translate.instant(
      'WORKSHOP.BOXES.TEXT.DELETE_MANY_WAIT'
    );
    const _deleteMessage = this.translate.instant(
      'WORKSHOP.BOXES.TEXT.DELETE_MANY_MESSAGE'
    );

    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (!res) {
          return;
        }

        const idsForDeletion: string[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.selection.selected.length; i++) {
          idsForDeletion.push(this.selection.selected[i].id);
        }
        this.store.dispatch(new DeleteManyBoxes({ ids: idsForDeletion }));
        this.layoutUtilsService.showActionNotification(
          _deleteMessage,
          MessageType.Delete
        );
        this.selection.clear();
      });
  }

  editBox(id) {
    this.router.navigate(['../boxes/edit', id], {
      relativeTo: this.activatedRoute,
    });
  }

  createBox() {
    this.router.navigateByUrl('/workshop/boxes/add');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.boxesResult.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.boxesResult.forEach((row) => this.selection.select(row));
    }
  }
}
