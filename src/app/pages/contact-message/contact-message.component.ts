import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactMessage } from 'src/app/model/contact-message';
import { ContactUsService } from 'src/app/services/contact-us.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-contact-message',
  templateUrl: './contact-message.component.html',
  styleUrls: ['./contact-message.component.css']
})
export class ContactMessageComponent {

  messages: ContactMessage[] = [];
  displayedColumns: string[] = ['name', 'email', 'subject', 'message', 'createdAt', 'actions'];

  constructor(private contactMessageService: ContactUsService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.fetchMessages();
  }

  fetchMessages(): void {
    this.contactMessageService.getAllMessages().subscribe({
      next: ( messages ) => this.messages = messages.body,
      error: ({ error }) => this.showMessage(error.error?.errorMessage || 'Failed to fetch contact message')
    });
  }

  viewMessage(message: ContactMessage) {
    this.dialogService.openViewMessageDialog(message.message);
  }

  deleteMessage(message: ContactMessage) {
    this.dialogService.openConfirmDialog('Are you sure you want to delete this Message?')
    .afterClosed().subscribe((res:boolean) =>{
      if(res){
        this.contactMessageService.deleteMessage(message.contactMessageId!).subscribe({
          next: (data) => {
            this.showMessage(data.message);
            this.fetchMessages();
          },
          error: (error) => {
            this.showMessage(error.error?.errorMessage);
          }
        });
      }
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
