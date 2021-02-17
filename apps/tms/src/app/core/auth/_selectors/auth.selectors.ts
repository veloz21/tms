// NGRX
import { createSelector } from '@ngrx/store';
// Lodash
import { each, find, some } from 'lodash';
// Models
import { Role } from '../_models/role.model';

export const selectAuthState = (state) => state.auth;

export const isLoggedIn = createSelector(
  selectAuthState,
  (auth) => auth.loggedIn
);

export const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn);

export const currentAuthToken = createSelector(
  selectAuthState,
  (auth) => auth.authToken
);

export const isCompanyLoaded = createSelector(
  selectAuthState,
  (auth) => auth.isCompanyLoaded
);

export const currentCompany = createSelector(
  selectAuthState,
  (auth) => auth.company
);

// export const currentCompanyRoleIds = createSelector(
//     currentCompany,
//     Company => {
//         if (!Company) {
//             return [];
//         }

//         return Company.roles;
//     }
// );

// export const currentCompanyPermissionsIds = createSelector(
//     currentCompanyRoleIds,
//     selectAllRoles,
//     (CompanyRoleIds: number[], allRoles: Role[]) => {
//         const result = getPermissionsIdsFrom(CompanyRoleIds, allRoles);
//         return result;
//     }
// );

// export const checkHasCompanyPermission = (permissionId: number) => createSelector(
//     currentCompanyPermissionsIds,
//     (ids: number[]) => {
//         return ids.some(id => id === permissionId);
//     }
// );

// export const currentCompanyPermissions = createSelector(
//     currentCompanyPermissionsIds,
//     selectAllPermissions,
//     (permissionIds: number[], allPermissions: Permission[]) => {
//         const result: Permission[] = [];
//         each(permissionIds, id => {
//             const CompanyPermission = find(allPermissions, elem => elem.id === id);
//             if (CompanyPermission) {
//                 result.push(CompanyPermission);
//             }
//         });
//         return result;
//     }
// );

function getPermissionsIdsFrom(
  CompanyRolesIds: number[] = [],
  allRoles: Role[] = []
): number[] {
  const CompanyRoles: Role[] = [];
  each(CompanyRolesIds, (_id: number) => {
    const CompanyRole = find(allRoles, (_role: Role) => _role.id === _id);
    if (CompanyRole) {
      CompanyRoles.push(CompanyRole);
    }
  });

  const result: number[] = [];
  each(CompanyRoles, (_role: Role) => {
    each(_role.permissions, (id) => {
      if (!some(result, (_id) => _id === id)) {
        result.push(id);
      }
    });
  });
  return result;
}
