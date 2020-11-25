import { selectBoxesInitWaitingMessage, selectBoxesInStore, selectBoxesPageLoading } from '@selectors/boxes.selectors';
import { QueryResultsModel, BaseDataSource } from '@crud';
import { Store, select } from '@ngrx/store';
import { AppState } from '@reducers';

export class BoxesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectBoxesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectBoxesInitWaitingMessage)
    );

    this.store.pipe(
      select(selectBoxesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
