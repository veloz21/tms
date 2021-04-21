import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from '@tms/models';

@Component({
  selector: 'b404-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss']
})
export class UsersViewComponent implements OnInit {

  public user: UserModel;
  constructor(
    private dialogRef: MatDialogRef<UsersViewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { user: UserModel },
  ) { }

  ngOnInit() {
    this.user = this.data.user;
  }

  close() {
    this.dialogRef.close();
  }

}
