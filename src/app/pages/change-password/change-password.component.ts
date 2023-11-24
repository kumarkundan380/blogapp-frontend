import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePassword } from 'src/app/model/change-password';
import { UserService } from 'src/app/services/user.service';
import { confirmPasswordValidator } from 'src/app/validators/confirmPasswordValidator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;
  changePassword!: ChangePassword;
  hide=true;
  phide=true;
  token!: string;

  constructor(private activateRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private userService: UserService){
    
  }

  ngOnInit(): void {
    this.token = this.activateRoute.snapshot.params['token'];
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
	    confirmPassword: new FormControl('', Validators.required),
    },{ validators: confirmPasswordValidator });
  }

  onSubmit(){
    this.changePassword = {
      password:this.changePasswordForm.get('password')?.value,
      confirmPassword:this.changePasswordForm.get('confirmPassword')?.value,
      token:this.token
    }

    this.userService.changePassword(this.changePassword).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.changePasswordForm.reset();
        this.router.navigate([`/login`])
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
