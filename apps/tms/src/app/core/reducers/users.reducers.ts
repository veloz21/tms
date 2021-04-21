import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { UserActions, UserActionTypes } from '@tms/actions/user.actions';
import { QueryParamsModel } from '@tms/crud';
import { UserModel } from '@tms/models';

export interface UsersState extends EntityState<UserModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedUserId: string;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<UserModel> = createEntityAdapter<UserModel>();

export const initialUsersState: UsersState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedUserId: undefined,
  showInitWaitingMessage: true
});

export function usersReducer(state = initialUsersState, action: UserActions): UsersState {
  switch (action.type) {
    case UserActionTypes.UsersPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading, lastCreatedUserId: undefined
      };
    case UserActionTypes.UsersActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading
      };
    case UserActionTypes.StoreUser:
    case UserActionTypes.CreateUserSuccess:
      return adapter.addOne(action.payload.user, {
        ...state,
        lastCreatedUserId: action.payload.user.id
      });
    case UserActionTypes.UpdateUserSuccess:
      return adapter.updateOne(action.payload.partialUser, state);

    case UserActionTypes.DeleteOneUser:
      return adapter.removeOne(action.payload.id, state);
    case UserActionTypes.DeleteManyUsers:
      return adapter.removeMany(action.payload.ids, state);
    case UserActionTypes.CancellUsersPage:
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    case UserActionTypes.LoadUsersPage:
      return adapter.addMany(action.payload.users, {
        ...initialUsersState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    default:
      return state;
  }
}

export const getUserState = createFeatureSelector<UserModel>('users');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
