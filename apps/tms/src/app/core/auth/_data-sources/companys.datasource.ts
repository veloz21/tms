// RxJS
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../reducers';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
import { selectCompanysInStore, selectCompanysPageLoading, selectCompanysShowInitWaitingMessage } from '../_selectors/company.selectors';


export class CompanysDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCompanysPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCompanysShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectCompanysInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
