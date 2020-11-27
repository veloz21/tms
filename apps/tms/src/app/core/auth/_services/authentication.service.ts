import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICompany, IUser } from '@bits404/api-interfaces';
import { environment } from '@tms/environments/environment';
import { HttpService } from '@tms/services';
import { AuthService } from 'ngx-auth';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { AuthModel, CompanyModel } from '../_models';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { TokenStorage } from './token-storage.service';

const API_LOGIN_URL = environment.endpoint + 'api/auth/login';
const API_REGISTER_URL = environment.endpoint + 'api/auth/register';
const API_TOKEN_URL = environment.endpoint + 'api/auth/token';
const API_PERMISSION_URL = '';
const API_ROLES_URL = '';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends HttpService implements AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
  };

  isLoggedIn: BehaviorSubject<boolean>;
  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
  ) {
    super();
    this.isLoggedIn = new BehaviorSubject(false);
    this.isAuthorized().subscribe(isLoggedIn => this.isLoggedIn.next(isLoggedIn));
  }

  /**
   * Check, if user already authorized.
   * @description Should return Observable with true or false values
   * @memberOf AuthService
   */
  public isAuthorized(): Observable<boolean> {
    return this.tokenStorage.getAccessToken().pipe(map(token => {
      console.log('isAuthorized', token);
      return !!token;
    }));
  }

  /**
   * Get access token
   * @description Should return access token in Observable from e.g. localStorage
   */
  public getAccessToken(): Observable<string> {
    console.log('AuthenticationService getAccessToken');
    return this.tokenStorage.getAccessToken();
  }

  /**
   * Function, that should perform refresh token verifyTokenRequest
   * @description Should be successfully completed so interceptor
   * can execute pending requests or retry original one
   */
  public refreshToken(): Observable<AuthModel> {
    return this.tokenStorage.getRefreshToken().pipe(
      switchMap((refreshToken: string) => {
        return this.http.post<AuthModel>(API_TOKEN_URL, { refreshToken }, this.httpOptions);
      }),
      tap(this.saveAccessData.bind(this)),
      catchError(this.handleError('refreshToken'))
    );
  }

  /**
   * Function, checks response of failed request to determine,
   * whether token be refreshed or not.
   * @description Essentialy checks status
   */
  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return response.status === 401;
  }

  /**
   * Verify that outgoing request is refresh-token,
   * so interceptor won't intercept this request
   */
  public verifyTokenRequest(url: string): boolean {
    return url.endsWith('auth/token');
  }

  public login(user: Partial<IUser>): Observable<AuthModel> {
    return this.http.post<AuthModel>(API_LOGIN_URL, user, this.httpOptions).pipe(
      tap(() => this.isLoggedIn.next(true)),
      tap(this.saveAccessData.bind(this)),
      switchMapTo(this.getCurrentUser()),
      catchError(this.handleError('login'))
    );
  }

  public getCompanyByToken(): Observable<CompanyModel> {
    const companyToken = localStorage.getItem(environment.authTokenKey);
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Authorization', 'Bearer ' + companyToken);

    return this.http.get<CompanyModel>(API_LOGIN_URL, {
      headers: httpHeaders
    }
    );
  }

  public loginByToken(account: string, token: string): Observable<any> {
    return this.tokenStorage.getRefreshToken().pipe(
      switchMap((refreshToken: string) => {
        return this.http.post<AuthModel>(API_TOKEN_URL, { refreshToken }, this.httpOptions);
      }),
      tap(this.saveAccessData.bind(this)),
      catchError(err => {
        this.logout();
        return throwError(err);
      })
    );
  }

  public logout(): Observable<void> {
    return this.http.post(API_LOGIN_URL, {}, { responseType: 'text' }).pipe(
      tap(() => this.tokenStorage.clear()),
      tap(() => this.isLoggedIn.next(false)),
      catchError(this.handleError('logout'))
    );
  }

  public saveAccessData(authData: AuthModel) {
    if (!!authData) {
      if (authData.accessToken) {
        this.tokenStorage.setAccessToken(authData.accessToken);
      }
      if (authData.refreshToken) {
        this.tokenStorage.setRefreshToken(authData.refreshToken);
      }
    }
  }

  public register(company: Partial<ICompany>, user: Partial<IUser>): Observable<string> {
    return this.http.post(API_REGISTER_URL, { company, user }, this.httpOptions).pipe(
      switchMapTo(this.login(user)),
      catchError(this.handleError('register'))
    );
  }

  // public recoverPassword(email: string): Observable<any> {
  //   return this.http.post(API_LOGIN_URL, { email }, this.httpOptions).pipe(
  //     catchError(this.handleError('recoverPassword'))
  //   );
  // }

  // public changePassword(oldPassword: string, newPassword: string): Observable<any> {
  //   return this.http.put(API_LOGIN_URL, { oldPassword, newPassword }, this.httpOptions).pipe(
  //     catchError(this.handleError('changePassword'))
  //   );
  // }

  public getCurrentUser(): Observable<any> {
    return of({});
    // return this.http.get<CompanyModel>(API_LOGIN_URL, this.httpOptions).pipe(
    //   tap(user => this.tokenStorage.setUser(user)),
    //   catchError(this.handleError('changePassword'))
    // );
  }

  getVersion(): Observable<any> {

    const hashUrl = `hash.json?v=${(new Date()).getTime()}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(hashUrl, httpOptions);
  }

  public requestPassword(email: string): Observable<any> {
    return this.http.get(API_LOGIN_URL + '/forgot?=' + email)
      .pipe(catchError(this.handleError('forgot-password')));
  }

  getAllCompanys(): Observable<CompanyModel[]> {
    return this.http.get<CompanyModel[]>(API_LOGIN_URL);
  }

  getCompanyById(companyId: number): Observable<CompanyModel> {
    return this.http.get<CompanyModel>(API_LOGIN_URL + `/${companyId}`);
  }

  // DELETE => delete the user from the server
  deleteCompany(companyId: number) {
    const url = `${API_LOGIN_URL}/${companyId}`;
    return this.http.delete(url);
  }

  // UPDATE => PUT: update the user on the server
  updateCompany(_company: CompanyModel): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_LOGIN_URL, _company, {
      headers: httpHeaders
    }
    );
  }

  // CREATE =>  POST: add a new user to the server
  createCompany(company: CompanyModel): Observable<CompanyModel> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<CompanyModel>(API_LOGIN_URL, company, {
      headers: httpHeaders
    }
    );
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  findCompanys(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<QueryResultsModel>(API_LOGIN_URL + '/findUsers', queryParams, {
      headers: httpHeaders
    }
    );
  }

  // Permission
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(API_PERMISSION_URL);
  }

  getRolePermissions(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
  }

  // Roles
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(API_ROLES_URL);
  }

  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
  }

  // CREATE =>  POST: add a new role to the server
  createRole(role: Role): Observable<Role> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<Role>(API_ROLES_URL, role, {
      headers: httpHeaders
    }
    );
  }

  // UPDATE => PUT: update the role on the server
  updateRole(role: Role): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_ROLES_URL, role, {
      headers: httpHeaders
    }
    );
  }

  // DELETE => delete the role from the server
  deleteRole(roleId: number): Observable<Role> {
    const url = `${API_ROLES_URL}/${roleId}`;
    return this.http.delete<Role>(url);
  }

  // Check Role Before deletion
  isRoleAssignedToUsers(roleId: number): Observable<boolean> {
    return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
  }

  findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, {
      headers: httpHeaders
    }
    );
  }
}
