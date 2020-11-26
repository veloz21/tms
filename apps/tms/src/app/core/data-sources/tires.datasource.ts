import { select, Store } from '@ngrx/store';
import { BaseDataSource, QueryResultsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { selectTiresInitWaitingMessage, selectTiresInStore, selectTiresPageLoading } from '@tms/selectors/tire.selectors';

export class TiresDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectTiresPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectTiresInitWaitingMessage)
    );

    this.store.pipe(
      select(selectTiresInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
