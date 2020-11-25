// Angular
import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DeleteDialogComponent } from '@shared/dialogs/delete-dialog/delete-dialog.component';
import { ErrorDialogComponent } from '@shared/dialogs/error-dialog/error-dialog.component';
import { InfoDialogComponent } from '@shared/dialogs/info-dialog/info-dialog.component';
// Partials for CRUD
import {
	ActionNotificationComponent,

	FetchEntityDialogComponent,
	UpdateStatusDialogComponent
} from '../../../../views/partials/content/crud';

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
	deleteElement( title: string = '', description: string = '', waitDesciption: string = '' ) {
		return this.dialog.open(DeleteDialogComponent, {
			data: { title, description, waitDesciption,   },
			width: '440px'
		});
	}

	infoElement(title: string = '', description: string = '') {
    return this.dialog.open(InfoDialogComponent, {
      data: { title, description },
      width: '440px'
    });
	}
	errorElement(title: string = '', description: string = '') {
    return this.dialog.open(ErrorDialogComponent, {
      data: { title, description },
      width: '440px'
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
