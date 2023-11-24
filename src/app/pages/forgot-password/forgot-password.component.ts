import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgotPassword } from 'src/app/model/forgot-password';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  forgotPassword!: ForgotPassword;
  isFormSubmitted!: boolean;
  message!: string;

  constructor(private formBuilder: FormBuilder,
  private userService: UserService,
  private _snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      emailId: new FormControl('',[Validators.required, Validators.email])
    });
    this.isFormSubmitted = true;
  }

  onSubmit(){
    this.forgotPassword = {
      emailId:this.forgotPasswordForm.get('emailId')?.value,
    }
    this.userService.forgotPassword(this.forgotPassword).subscribe({
      next: (data) => {
          this.message = data.body;
          this.isFormSubmitted = false;
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.forgotPasswordForm.reset();
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
  }

}
