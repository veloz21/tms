import { ComponentType } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: '',
})
export class DialogRoutingEntryComponent {

  protected component: ComponentType<unknown>;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.openDialog();
  }

  openDialog(): void {
    if (!this.component) {
      return;
    }

    const dialogRef = this.dialog.open(this.component);
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

}
