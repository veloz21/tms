import { IUser } from '@bits404/api-interfaces';
import { Action } from '@ngrx/store';
import { CompanyModel } from '../_models/company.model';

export enum AuthActionTypes {
  Login = '[Login] Action',
  LoginSuccess = '[Login]Action Success',
  LoginError = '[Login]Action Error',
  Logout = '[Logout] Action',
  Register = '[Register] Action',
  CompanyRequested = '[Request Company] Action',
  CompanyLoaded = '[Load Company] Auth API',
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
  constructor(public payload: { user: Partial<IUser> }) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;
  constructor(public payload: { accessToken: string; refreshToken: string }) {}
}

export class LoginError implements Action {
  readonly type = AuthActionTypes.LoginError;
  constructor(public payload: { error: string }) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class Register implements Action {
  readonly type = AuthActionTypes.Register;
  constructor(public payload: { accessToken: string; refreshToken: string }) {}
}

export class CompanyRequested implements Action {
  readonly type = AuthActionTypes.CompanyRequested;
}

export class CompanyLoaded implements Action {
  readonly type = AuthActionTypes.CompanyLoaded;
  constructor(public payload: { company: CompanyModel }) {}
}

export type AuthActions =
  | Login
  | LoginSuccess
  | Logout
  | Register
  | CompanyRequested
  | CompanyLoaded;
