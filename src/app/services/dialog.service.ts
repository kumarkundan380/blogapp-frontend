import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private matDialog: MatDialog) { }

  openConfirmDialog(message:string){
    return this.matDialog.open(ConfirmDialogComponent, {
      width:'30%',
      panelClass:'confirm-dialog-container',
      disableClose:true,
      position: { top: "1rem" },
      data :{
        message : message
      }
    });
  }
}
