import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { QueryParamsModel } from '@tms/crud';
import { UserModel } from '@tms/models';

export enum UserActionTypes {
  GetUser = '[Edit User Component] Get User',
  StoreUser = '[Edit User Component] Store User',
  CreateUser = '[Edit User Component] Create User ',
  CreateUserError = '[Edit User Component] Create User Error',
  CreateUserSuccess = '[Edit User Component] Create User Success',
  UpdateUser = '[Edit User Component] Update User ',
  UpdateUserSuccess = '[Edit User Component] Update User Success ',
  DeleteOneUser = '[Users List Page] One User Deleted',
  DeleteManyUsers = '[Users List Page] Many Selected Users Deleted',
  RequestUsersPage = '[Users List Page] Users Page Requested',
  LoadUsersPage = '[Users API] Users Page Loaded',
  CancellUsersPage = '[Users API] Users Page Cancelled',
  UsersPageToggleLoading = '[Users] Users Page Toggle Loading',
  UsersActionToggleLoading = '[Users] Users Action Toggle Loading',
  ViewUser = '[View Useres Component] View User',
}

export class GetUser implements Action {
  readonly type = UserActionTypes.GetUser;
  constructor(public payload: { id: string }) { }
}

export class StoreUser implements Action {
  readonly type = UserActionTypes.StoreUser;
  constructor(public payload: { user: UserModel }) { }
}

export class CreateUser implements Action {
  readonly type = UserActionTypes.CreateUser;
  constructor(public payload: { user: UserModel }) { }
}

export class CreateUserError implements Action {
  readonly type = UserActionTypes.CreateUserError;
  constructor(public payload: { isError: any }) { }
}

export class CreateUserSuccess implements Action {
  readonly type = UserActionTypes.CreateUserSuccess;
  constructor(public payload: { user: UserModel }) { }
}

export class UpdateUser implements Action {
  readonly type = UserActionTypes.UpdateUser;
  constructor(public payload: {
    partialUser: Update<UserModel>, // For State update
    user: UserModel // For Server update (through service)
  }) { }
}

export class UpdateUserSuccess implements Action {
  readonly type = UserActionTypes.UpdateUserSuccess;
  constructor(public payload: {
    partialUser: Update<UserModel>, // For State update
    user: UserModel // For Server update (through service)
  }) { }
}

export class DeleteOneUser implements Action {
  readonly type = UserActionTypes.DeleteOneUser;
  constructor(public payload: { id: string }) { }
}

export class DeleteManyUsers implements Action {
  readonly type = UserActionTypes.DeleteManyUsers;
  constructor(public payload: { ids: string[] }) { }
}

export class RequestUsersPage implements Action {
  readonly type = UserActionTypes.RequestUsersPage;
  constructor(public payload: { page: QueryParamsModel }) { }
}

export class LoadUsersPage implements Action {
  readonly type = UserActionTypes.LoadUsersPage;
  constructor(public payload: {
    users: UserModel[],
    totalCount: number,
    page: QueryParamsModel
  }) { }
}

export class CancellUsersPage implements Action {
  readonly type = UserActionTypes.CancellUsersPage;
}

export class UsersPageToggleLoading implements Action {
  readonly type = UserActionTypes.UsersPageToggleLoading;
  constructor(public payload: {
    isLoading: boolean
  }) { }
}

export class UsersActionToggleLoading implements Action {
  readonly type = UserActionTypes.UsersActionToggleLoading;
  constructor(public payload: {
    isLoading: boolean
  }) { }
}

export class ViewUser implements Action {
  readonly type = UserActionTypes.ViewUser;
  constructor(public payload: { id: string }) { }
}
export type UserActions =
  | CreateUser
  | UpdateUser
  | DeleteOneUser
  | DeleteManyUsers
  | RequestUsersPage
  | LoadUsersPage
  | CancellUsersPage
  | UsersPageToggleLoading
  | UsersActionToggleLoading
  | CreateUserError
  | CreateUserSuccess
  | UpdateUserSuccess
  | GetUser
  | StoreUser
  | ViewUser
  ;
