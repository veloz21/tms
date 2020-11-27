// Angular
import { Component, Input, OnInit } from '@angular/core';
// NGRX
import { Store } from '@ngrx/store';
// RxJS
import { Observable } from 'rxjs';
import { CompanyModel, Logout } from '../../../../../core/auth';
// State
import { AppState } from '../../../../../core/reducers';

@Component({
  selector: 'b404-user-profile2',
  templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
  // Public properties
  user$: Observable<CompanyModel>;

  @Input() avatar = true;
  @Input() greeting = true;
  @Input() badge: boolean;
  @Input() icon: boolean;

  /**
   * Component constructor
   *
   * @param store: Store<AppState>
   */
  constructor(private store: Store<AppState>) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    // this.user$ = this.store.pipe(select(currentCompany));
    // console.log(this.user$);
  }

  /**
   * Log out
   */
  logout() {
    this.store.dispatch(new Logout());
  }
}
