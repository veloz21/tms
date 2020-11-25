// Angular
import { Injectable } from '@angular/core';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
// RxJS
import { map, mergeMap, tap } from 'rxjs/operators';
// State
import { AppState } from '../../reducers';
// CRUD
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { CompanyActionTypes, CompanyCreated, CompanyDeleted, CompanyOnServerCreated, CompanysActionToggleLoading, CompanysPageLoaded, CompanysPageRequested, CompanysPageToggleLoading, CompanyUpdated } from '../_actions/company.actions';
// Services
import { AuthenticationService } from '../_services';
@Injectable()
export class CompanyEffects {
	showPageLoadingDistpatcher = new CompanysPageToggleLoading({
		isLoading: true
	});
	hidePageLoadingDistpatcher = new CompanysPageToggleLoading({
		isLoading: false
	});

	showActionLoadingDistpatcher = new CompanysActionToggleLoading({
		isLoading: true
	});
	hideActionLoadingDistpatcher = new CompanysActionToggleLoading({
		isLoading: false
	});

	@Effect()
	loadCompanysPage$ = this.actions$
		.pipe(
			ofType < CompanysPageRequested > (CompanyActionTypes.CompanysPageRequested),
			mergeMap(({
				payload
			}) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.auth.findCompanys(payload.page);
				const lastQuery = of (payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: QueryResultsModel = response[0];
				const lastQuery: QueryParamsModel = response[1];
				return new CompanysPageLoaded({
					Companys: result.items,
					totalCount: result.totalCount,
					page: lastQuery
				});
			}),
		);

	@Effect()
	deleteCompany$ = this.actions$
		.pipe(
			ofType < CompanyDeleted > (CompanyActionTypes.CompanyDeleted),
			mergeMap(({
				payload
			}) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.deleteCompany(payload.id);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	updateCompany$ = this.actions$
		.pipe(
			ofType < CompanyUpdated > (CompanyActionTypes.CompanyUpdated),
			mergeMap(({
				payload
			}) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.updateCompany(payload.Company);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	createCompany$ = this.actions$
		.pipe(
			ofType < CompanyOnServerCreated > (CompanyActionTypes.CompanyOnServerCreated),
			mergeMap(({
				payload
			}) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.createCompany(payload.company).pipe(
					tap(res => {
						this.store.dispatch(new CompanyCreated({
							company: res
						}));
					})
				);
			}),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	constructor(private actions$: Actions, private auth: AuthenticationService, private store: Store < AppState > ) {}
}
