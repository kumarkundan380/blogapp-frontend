import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ViewMessageDialogComponent } from '../components/view-message-dialog/view-message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private readonly matDialog: MatDialog) {}

  openConfirmDialog(message: string): MatDialogRef<ConfirmDialogComponent> {
    return this.matDialog.open(ConfirmDialogComponent, {
      width: '30%',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: { top: '1rem' },
      data: { message }
    });
  }

  openViewMessageDialog(message: string): void {
    this.matDialog.open(ViewMessageDialogComponent, {
      width: '40%',
      disableClose: true,
      position: { top: '1rem' },
      data: { message }
    });
  }

}
