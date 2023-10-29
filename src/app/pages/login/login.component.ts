import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/login-request';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  logInForm!: FormGroup;
  loginRequest!: LoginRequest;
  isLoggedIn!: boolean;
  profileImage!: string;

  constructor(private authService : AuthService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
    this.authService.showLoginButtonSubject.next(false);
    this.authService.showSignupButtonSubject.next(true);
    this.profileImage = "../../../assets/profile.png";
    this.logInForm = this.formBuilder.group({
      userName: new FormControl('', Validators.required),
	    password: new FormControl('', Validators.required),
    });
  }

  onSubmit(){
    this.loginRequest = {
      userName:this.logInForm.get('userName')?.value,
      password:this.logInForm.get('password')?.value
    }
    this.logIn();
  }

  logIn(){
    this.authService.loginUser(this.loginRequest).subscribe({
      next: (data) => {
        this.authService.setUserInfo(data.body);
        this.authService.logInStatusSubject.next(true);
        if(data.body.user.userImage){
          this.authService.profileImageSubject.next(data.body.user.userImage);
          //this.profileImage = data.body.user.userImage;
        } 
        this._snackBar.open(data.message, "OK", {
        duration: 3000,
        verticalPosition: 'top'
      })
      this.logInForm.reset();
      if(this.authService.isAdminUser(data.body.user)) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    },
      error: (error) => {
        this.authService.logInStatusSubject.next(false);
        this._snackBar.open(error?.error?.errorMessage, "OK", {
        duration: 3000,
        verticalPosition: 'top'
      })
    }      
    }); 
  }

  resetForm(){
    this.logInForm = this.formBuilder.group({
      userName: new FormControl('', Validators.required),
	    password: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.authService.showLoginButtonSubject.next(true);
  }


}
