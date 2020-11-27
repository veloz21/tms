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
  selector: 'b404-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  // Public properties
  company$: Observable<CompanyModel>;

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

  ngOnInit(): void {
    // this.company$ = this.store.pipe(select(currentCompany));
  }

  /**
   * Log out
   */
  logout() {
    this.store.dispatch(new Logout());
  }
}
