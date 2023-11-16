import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  title!: string;
  forgotPasswordForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private matDialogRed: MatDialogRef<ForgotPasswordComponent>,private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.title = this.data.title;
    this.forgotPasswordForm = this.formBuilder.group({
      emailId: new FormControl('',[Validators.required, Validators.email])
    });
  }

  onSubmit(){}

  onClose() {
    this.forgotPasswordForm.reset();
    this.matDialogRed.close();
  }

}
