import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '@crud';
import { BoxModel } from '@models';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_BOXES_URL = 'api/boxes';
// Fake REST API (Mock)
// This method emulates server calls
@Injectable()
export class BoxesService {
	lastFilter$: BehaviorSubject < QueryParamsModel > = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

	// CREATE =>  POST: add a new product to the server
	createBox(box): Observable < BoxModel > {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post < BoxModel > (API_BOXES_URL, box, {
			headers: httpHeaders
		});
	}

	// READ
	getAllBoxes(): Observable < BoxModel[] > {
		return this.http.get < BoxModel[] > (API_BOXES_URL);
	}

	getBoxById(boxId: number): Observable < BoxModel > {
		return this.http.get < BoxModel > (API_BOXES_URL + `/${boxId}`);
	}

	findBoxes(queryParams: QueryParamsModel): Observable < QueryResultsModel > {
		return this.getAllBoxes().pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams, ['status', 'condition']);
				return of(result);
			})
		);
	}

	// UPDATE => PUT: update the product on the server
	updateBox(box: BoxModel): Observable < any > {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_BOXES_URL, box, {
			headers: httpHeaders
		});
	}

	// UPDATE Status
	// Comment this when you start work with real server
	// This code imitates server calls

	// DELETE => delete the product from the server
	deleteBox(boxId: number): Observable < BoxModel > {
		const url = `${API_BOXES_URL}/${boxId}`;
		return this.http.delete < BoxModel > (url);
	}

	deleteBoxes(ids: number[] = []): Observable < any > {
		const tasks$ = [];
		const length = ids.length;
		// tslint:disable-next-line:prefer-const
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteBox(ids[i]));
		}
		return forkJoin(tasks$);
	}
	public findQueryBoxes(value: string): Observable<BoxModel[]> {
    const queryParams = new QueryParamsModel(
      { Name: value },
      'asc',
      'serialNumber',
    );
    return this.http.get<BoxModel[]>(API_BOXES_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams);
        return of(result.items as BoxModel[]);
      })
    );
  }
}
