import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionNotificationComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '@tms/partials/content/crud';
import { DeleteDialogComponent } from '@tms/shared/dialogs/delete-dialog/delete-dialog.component';
import { ErrorDialogComponent } from '@tms/shared/dialogs/error-dialog/error-dialog.component';
import { ChangeStatusDialogComponent } from '../../../../views/pages/travels/components/change-status-dialog/change-status-dialog.component';
import { DialogOptions } from '../../../../views/shared/dialogs/dialog-options.interface';
import { TravelStatusModel } from '../../../models';

export enum MessageType {
  Create,
  Read,
  Update,
  Delete
}

@Injectable()
export class LayoutUtilsService {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  showActionNotification(
    _message: string,
    _type: MessageType = MessageType.Create,
    _duration: number = 5000,
    _showCloseButton: boolean = true,
    _showUndoButton: boolean = false,
    _undoButtonDuration: number = 3000,
    _verticalPosition: 'top' | 'bottom' = 'top'
  ) {
    const _data = {
      message: _message,
      snackBar: this.snackBar,
      showCloseButton: _showCloseButton,
      showUndoButton: _showUndoButton,
      undoButtonDuration: _undoButtonDuration,
      verticalPosition: _verticalPosition,
      type: _type,
      action: 'Undo'
    };
    return this.snackBar.openFromComponent(ActionNotificationComponent, {
      duration: _duration,
      data: _data,
      verticalPosition: _verticalPosition
    });
  }

  deleteElement(dialogOptions: DialogOptions) {
    return this.dialog.open(DeleteDialogComponent, {
      data: dialogOptions,
      width: '440px'
    });
  }

  infoElement(dialogOptions: DialogOptions) {
    // return this.dialog.open(InfoDialogComponent, {
    //   data: dialogOptions,
    //   width: '440px'
    // });
  }

  errorElement(dialogOptions: DialogOptions) {
    return this.dialog.open(ErrorDialogComponent, {
      data: dialogOptions,
      width: '440px'
    });
  }

  travelStatus(status: TravelStatusModel) {
    return this.dialog.open(ChangeStatusDialogComponent, {
      data: { status },
      width: '640px'
    });
  }

  fetchElements(_data) {
    return this.dialog.open(FetchEntityDialogComponent, {
      data: _data,
      width: '400px'
    });
  }

  /**
   * Showing Update Status for Entites Window
   *
   * @param title: string
   * @param statuses: string[]
   * @param messages: string[]
   */
  updateStatusForEntities(title, statuses, messages) {
    return this.dialog.open(UpdateStatusDialogComponent, {
      data: { title, statuses, messages },
      width: '480px'
    });
  }
}
