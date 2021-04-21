import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetUser } from '@tms/actions/user.actions';
import { UserModel } from '@tms/models';
import { selectUserById } from '@tms/selectors/user.selectors';
import { Observable } from 'rxjs';
import { BaseResolver } from './base-resolver';

@Injectable()
export class UserResolver extends BaseResolver<UserModel> implements Resolve<UserModel> {
  protected backRoute: string = '/workshop/users';
  protected getEmptyModel(): UserModel {
    return new UserModel();
  }

  protected getModelAction(id: string): GetUser {
    return new GetUser({ id });
  }

  protected selectModelFromStore(id: string): Observable<UserModel> {
    return this.store.select(selectUserById(id));
  }
}
