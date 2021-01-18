// Actions
import { AuthActions, AuthActionTypes } from '../_actions/auth.actions';
// Models
import { CompanyModel } from '../_models/company.model';

export interface AuthState {
  loggedIn: boolean;
  authToken: string;
  refreshToken: string;
  company: CompanyModel;
  isCompanyLoaded: boolean;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  authToken: undefined,
  refreshToken: undefined,
  company: undefined,
  isCompanyLoaded: false,
};

export function authReducer(
  state = initialAuthState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginSuccess: {
      const _token: string = localStorage.getItem('accessToken');
      const _refreshToken: string = localStorage.getItem('refreshToken');
      return {
        loggedIn: true,
        authToken: _token,
        refreshToken: _refreshToken,
        company: undefined,
        isCompanyLoaded: false,
      };
    }

    case AuthActionTypes.Register: {
      const _token: string = action.payload.accessToken;
      const _refreshToken: string = action.payload.refreshToken;
      return {
        loggedIn: true,
        authToken: _token,
        refreshToken: _refreshToken,
        company: undefined,
        isCompanyLoaded: false,
      };
    }

    case AuthActionTypes.Logout:
      return initialAuthState;

    case AuthActionTypes.CompanyLoaded: {
      const _company: CompanyModel = action.payload.company;
      return {
        ...state,
        company: _company,
        isCompanyLoaded: true,
      };
    }

    default:
      return state;
  }
}
