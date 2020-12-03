import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@crud';
import { TireModel } from '@models';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_TIRES_URL = 'api/tires';
// Fake REST API (Mock)
// This method emulates server calls
@Injectable()
export class TiresService {
	lastFilter$: BehaviorSubject < QueryParamsModel > = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

	// CREATE =>  POST: add a new product to the server
	createTire(tire): Observable < TireModel > {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post < TireModel > (API_TIRES_URL, tire, {
			headers: httpHeaders
		});
	}

	// READ
	getAllTires(): Observable < TireModel[] > {
		return this.http.get < TireModel[] > (API_TIRES_URL);
	}

	getTireById(tireId: number): Observable < TireModel > {
		return this.http.get < TireModel > (API_TIRES_URL + `/${tireId}`);
	}

	findTires(queryParams: QueryParamsModel): Observable < QueryResultsModel > {
		return this.getAllTires().pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
				return of(result);
			})
		);
	}

	// UPDATE => PUT: update the product on the server
	updateTire(tire: TireModel): Observable < any > {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_TIRES_URL, tire, {
			headers: httpHeaders
		});
	}

	// UPDATE Status
	// Comment this when you start work with real server
	// This code imitates server calls

	// DELETE => delete the product from the server
	deleteTire(tireId: number): Observable < TireModel > {
		const url = `${API_TIRES_URL}/${tireId}`;
		return this.http.delete < TireModel > (url);
	}

	deleteTires(ids: number[] = []): Observable < any > {
		const tasks$ = [];
		const length = ids.length;
		// tslint:disable-next-line:prefer-const
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteTire(ids[i]));
		}
		return forkJoin(tasks$);
	}
	public findQueryTires(value: string): Observable<TireModel[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    return this.http.get<TireModel[]>(API_TIRES_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams);
        return of(result.items as TireModel[]);
      })
    );
  }
}
