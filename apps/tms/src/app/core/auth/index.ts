// SERVICES
export { AuthNotice } from './auth-notice/auth-notice.interface';
export { AuthNoticeService } from './auth-notice/auth-notice.service';
// ACTIONS
export {
  AuthActions,
  AuthActionTypes,
  CompanyLoaded,
  Login,
  Logout,
  Register,
  RequestCompany,
} from './_actions/auth.actions';
export {
  CompanyCreated,
  CompanyDeleted,
  CompanyOnServerCreated,
  CompanysActionToggleLoading,
  CompanysPageCancelled,
  CompanysPageLoaded,
  CompanysPageRequested,
  CompanysPageToggleLoading,
  CompanyUpdated,
} from './_actions/company.actions';
export {
  AllPermissionsLoaded,
  AllPermissionsRequested,
  PermissionActions,
  PermissionActionTypes,
} from './_actions/permission.actions';
export {
  AllRolesLoaded,
  AllRolesRequested,
  RoleActions,
  RoleActionTypes,
  RoleCreated,
  RoleDeleted,
  RoleOnServerCreated,
  RolesPageCancelled,
  RolesPageLoaded,
  RolesPageRequested,
  RoleUpdated,
} from './_actions/role.actions';
export { CompanysDataSource } from './_data-sources/companys.datasource';
// DATA SOURCERS
export { RolesDataSource } from './_data-sources/roles.datasource';
// EFFECTS
export { AuthEffects } from './_effects/auth.effects';
export { CompanyEffects } from './_effects/company.effects';
export { PermissionEffects } from './_effects/permission.effects';
export { RoleEffects } from './_effects/role.effects';
// GUARDS
export { AuthGuard } from './_guards/auth.guard';
export { ModuleGuard } from './_guards/module.guard';
export { Address } from './_models/address.model';
// MODELS
export { CompanyModel } from './_models/company.model';
export { Permission } from './_models/permission.model';
export { Role } from './_models/role.model';
export { SocialNetworks } from './_models/social-networks.model';
// REDUCERS
export { authReducer } from './_reducers/auth.reducers';
export { CompanysReducer } from './_reducers/company.reducers';
export { permissionsReducer } from './_reducers/permission.reducers';
export { rolesReducer } from './_reducers/role.reducers';
// SELECTORS
// export { checkHasCompanyPermission, currentAuthToken, currentCompany, currentCompanyPermissions, currentCompanyPermissionsIds, currentCompanyRoleIds, isCompanyLoaded, isLoggedIn, isLoggedOut } from './_selectors/auth.selectors';
export {
  selectCompanyById,
  selectCompanysActionLoading,
  selectCompanysInStore,
  selectCompanysPageLastQuery,
  selectCompanysPageLoading,
  selectCompanysShowInitWaitingMessage,
  selectHasCompanysInStore,
  selectLastCreatedCompanyId,
} from './_selectors/company.selectors';
export {
  allPermissionsLoaded,
  selectAllPermissions,
  selectAllPermissionsIds,
  selectPermissionById,
} from './_selectors/permission.selectors';
export {
  allRolesLoaded,
  selectAllRoles,
  selectAllRolesIds,
  selectLastCreatedRoleId,
  selectQueryResult,
  selectRoleById,
  selectRolesActionLoading,
  selectRolesPageLoading,
  selectRolesShowInitWaitingMessage,
} from './_selectors/role.selectors';
export { AuthDataContext } from './_server/auth.data-context';
export { AuthenticationService } from './_services';
