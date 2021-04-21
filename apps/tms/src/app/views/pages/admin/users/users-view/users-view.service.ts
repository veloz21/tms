import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserModel } from '@tms/models';
import { UserResolver } from '@tms/resolvers';
import { UsersViewComponent } from './users-view.component';

@Injectable()
export class UsersViewService {

  constructor(
    public dialog: MatDialog,
    private userResolver: UserResolver,
  ) { }

  openUserView(id: string) {
    const resolve = this.userResolver.manualResolve(id);
    if (resolve instanceof UserModel) {
      return this.openDialog(resolve);
    }

    resolve.subscribe(user => {
      this.openDialog(user);
    });
  }

  private openDialog(user: UserModel): void {
    const dialogRef = this.dialog.open(UsersViewComponent, {
      data: { user }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
    });
  }

}
