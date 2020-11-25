import { BaseDataSource, QueryResultsModel } from '@crud';
import { select, Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { selectTiresInitWaitingMessage, selectTiresInStore, selectTiresPageLoading } from '@selectors/tire.selectors';

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
