import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export class HttpService {
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(operation = 'operation', result?: any) {
    return (httpError: any): Observable<any> => {
      console.log('-----', httpError);
      const errorMsg = httpError.error && typeof httpError.error !== 'object' ? JSON.parse(httpError.error) && JSON.parse(httpError.error).message : httpError instanceof HttpErrorResponse && httpError.statusText || httpError.error || '';
      // TODO: send the error to remote logging infrastructure
      console.error(operation, httpError); // log to console instead
      return throwError(result || errorMsg);
    };
  }
}