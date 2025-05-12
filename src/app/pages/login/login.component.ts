import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginRequest } from 'src/app/model/login-request';
import { AuthService } from 'src/app/services/auth.service';

declare var grecaptcha: any; // Declare reCAPTCHA globall
declare global {
  interface Window {
    grecaptcha: any;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  logInForm!: FormGroup;
  hide: boolean = true;
  captchaError: boolean = false;
  captchaToken: string | null = null;
  profileImage: string = "../../../assets/profile.png";
  private subscriptions: Subscription = new Subscription();


  constructor(private authService : AuthService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {

    this.authService.showLoginButtonSubject.next(false);
    this.authService.showSignupButtonSubject.next(true);
    this.initializeForm();

    // Ensure reCAPTCHA is rendered correctly
    const checkRecaptcha = setInterval(() => {
      if (window['grecaptcha'] && window['grecaptcha'].render) {
        clearInterval(checkRecaptcha);
        grecaptcha.render('recaptcha-container', {
          sitekey: '6LcKFiQpAAAAAEsj9QIGJdQLWwC4fNUv2gPnWlUF',
          callback: (response: string) => this.onCaptchaResolved(response)
        });
      }
    }, 200); 
  }

  // Callback for reCAPTCHA
  onCaptchaResolved(token: string) {
    this.captchaToken = token;
    this.captchaError = false;
  }

  private initializeForm(): void {
    
    this.logInForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    
    if (this.logInForm.invalid) return;

    if (!this.captchaToken) {
      this.captchaError = true;
      this.showSnackBar('Please verify reCAPTCHA');
      return;
    }

    const loginRequestData: LoginRequest = {
      userName: this.logInForm.value.userName,
      password: this.logInForm.value.password,
      securityToken: this.captchaToken // Sending captcha token
    };

    this.subscriptions.add(
      this.authService.loginUser(loginRequestData).subscribe({
        next: (response) => {
          this.authService.setUserInfo(response.body);
          this.authService.logInStatusSubject.next(true);

          if (response.body.user.userImage) {
            this.authService.profileImageSubject.next(response.body.user.userImage);
          }

          this.showSnackBar(response.message);
          this.logInForm.reset();
          const isSuperAdmin = this.authService.isSuperAdminUser(response.body.user);
          const isAdmin = this.authService.isAdminUser(response.body.user);
          const redirectRoute = (isSuperAdmin || isAdmin) ? '/admin' : '/posts';
          this.router.navigate([redirectRoute]);
        },
        error: (error) => {
          this.authService.logInStatusSubject.next(false);
          this.showSnackBar(error?.error?.message);
          this.resetCaptcha();
        }
      })
    );
  }

  resetForm(): void {
    this.logInForm.reset();
    this.resetCaptcha();
  }

  private resetCaptcha(): void {
    this.captchaToken = null;
    grecaptcha.reset(); // Reset reCAPTCHA
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  ngOnDestroy(): void {
    this.authService.showLoginButtonSubject.next(true);
    this.subscriptions.unsubscribe(); // Prevent memory leaks
  }

}
