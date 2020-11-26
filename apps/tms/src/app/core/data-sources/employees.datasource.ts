import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { selectEmployeesInitWaitingMessage, selectEmployeesInStore, selectEmployeesPageLoading } from '@tms/selectors/employee.selectors';

export class EmployeesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(select(selectEmployeesPageLoading));

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectEmployeesInitWaitingMessage)
    );

    this.store
      .pipe(select(selectEmployeesInStore))
      .subscribe((response: QueryResultsModel) => {
        this.paginatorTotalSubject.next(response.totalCount);
        this.entitySubject.next(response.items);
      });
  }
}
