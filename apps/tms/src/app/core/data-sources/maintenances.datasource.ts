import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { selectMaintenancesInitWaitingMessage, selectMaintenancesInStore, selectMaintenancesPageLoading } from '@tms/selectors/maintenance.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ template: '' })
export class MaintenancesDataSource extends BaseDataSource implements OnDestroy {
  private ngUnsuscribe = new Subject();
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(select(selectMaintenancesPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectMaintenancesInitWaitingMessage)
    );

    this.store
      .pipe(select(selectMaintenancesInStore), takeUntil(this.ngUnsuscribe))
      .subscribe((response: QueryResultsModel) => {
        this.paginatorTotalSubject.next(response.totalCount);
        this.entitySubject.next(response.items);
      });
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }
}
