import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { CompanyModel } from '../_models/company.model';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {

  constructor() { }

  private setItem(name: string, item): void {
      localStorage.setItem(name, JSON.stringify(item));
  }

  private getItem(name: string) {
    const item = localStorage.getItem(name);
    try {
      return JSON.parse(item);
    } catch (e) { }
  }

  private removeItem(name: string): void {
    localStorage.removeItem(name);
  }


  public getAccessToken(): Observable<string> {
    // console.log('getAccessToken', this.getItem('accessToken') as string);
    return of(this.getItem('accessToken') as string);
  }

  public getRefreshToken(): Observable<string> {
    return of(this.getItem('refreshToken') as string);
  }

  public getCompany(): Observable<CompanyModel> {
    return of(this.getItem('company') as CompanyModel);
  }

  public setAccessToken(token: string): TokenStorage {
    this.setItem('accessToken', token);
    return this;
  }

  public setRefreshToken(token: string): TokenStorage {
    this.setItem('refreshToken', token);
    return this;
  }

  public setUser(company: CompanyModel): TokenStorage {
    this.setItem('company', company);
    return this;
  }

  /**
   * Remove tokens
   */
  public clear() {
    this.removeItem('accessToken');
    this.removeItem('refreshToken');
    this.removeItem('company');
  }
}
