import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-message-dialog',
  templateUrl: './view-message-dialog.component.html',
  styleUrls: ['./view-message-dialog.component.css']
})
export class ViewMessageDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    public dialogRef: MatDialogRef<ViewMessageDialogComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

}
