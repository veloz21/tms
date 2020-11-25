// NGRX
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
// Models
import { QueryParamsModel } from '../../_base/crud';
// CRUD
import { CompanyModel } from '../_models/company.model';

export enum CompanyActionTypes {
    AllCompanysRequested = '[Companys Module] All Companys Requested',
    AllCompanysLoaded = '[Companys API] All Companys Loaded',
    CompanyOnServerCreated = '[Edit Company Component] Company On Server Created',
    CompanyCreated = '[Edit Company Dialog] Company Created',
    CompanyUpdated = '[Edit Company Dialog] Company Updated',
    CompanyDeleted = '[Companys List Page] Company Deleted',
    CompanysPageRequested = '[Companys List Page] Companys Page Requested',
    CompanysPageLoaded = '[Companys API] Companys Page Loaded',
    CompanysPageCancelled = '[Companys API] Companys Page Cancelled',
    CompanysPageToggleLoading = '[Companys] Companys Page Toggle Loading',
    CompanysActionToggleLoading = '[Companys] Companys Action Toggle Loading'
}

export class CompanyOnServerCreated implements Action {
    readonly type = CompanyActionTypes.CompanyOnServerCreated;
    constructor(public payload: { company: CompanyModel }) { }
}

export class CompanyCreated implements Action {
    readonly type = CompanyActionTypes.CompanyCreated;
    constructor(public payload: { company: CompanyModel }) { }
}


export class CompanyUpdated implements Action {
    readonly type = CompanyActionTypes.CompanyUpdated;
    constructor(public payload: {
        partialCompany: Update<CompanyModel>,
        Company: CompanyModel
    }) { }
}

export class CompanyDeleted implements Action {
    readonly type = CompanyActionTypes.CompanyDeleted;
    constructor(public payload: { id: number }) {}
}

export class CompanysPageRequested implements Action {
    readonly type = CompanyActionTypes.CompanysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class CompanysPageLoaded implements Action {
    readonly type = CompanyActionTypes.CompanysPageLoaded;
    constructor(public payload: { Companys: CompanyModel[], totalCount: number, page: QueryParamsModel  }) { }
}


export class CompanysPageCancelled implements Action {
    readonly type = CompanyActionTypes.CompanysPageCancelled;
}

export class CompanysPageToggleLoading implements Action {
    readonly type = CompanyActionTypes.CompanysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class CompanysActionToggleLoading implements Action {
    readonly type = CompanyActionTypes.CompanysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type CompanyActions = CompanyCreated
| CompanyUpdated
| CompanyDeleted
| CompanyOnServerCreated
| CompanysPageLoaded
| CompanysPageCancelled
| CompanysPageToggleLoading
| CompanysPageRequested
| CompanysActionToggleLoading;
