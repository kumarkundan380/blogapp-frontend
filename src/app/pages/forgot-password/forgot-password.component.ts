import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgotPassword } from 'src/app/model/forgot-password';
import { UserService } from 'src/app/services/user.service';

declare var grecaptcha: any; // Declare reCAPTCHA globall
declare global {
  interface Window {
    grecaptcha: any;
  }
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  isFormSubmitted = true;
  message: string = '';
  captchaToken: string = '';
 
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {

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

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.forgotPasswordForm.invalid || !this.captchaToken) {
      this.showSnackbar('Please complete the captcha verification.', 'error');
      return;
    }

    const forgotPasswordData: ForgotPassword = {
      emailId: this.forgotPasswordForm.value.emailId,
      securityToken: this.captchaToken // Sending captcha token
    };
    this.userService.forgotPassword(forgotPasswordData).subscribe({
      next: (response) => {
        this.message = response.body || 'Password reset instructions sent.';
        this.isFormSubmitted = false;
        this.showSnackbar(response.message || 'Request successful', 'success');
        this.resetForm();
      },
      error: (error) => {
        this.showSnackbar(error?.error?.errorMessage || 'An error occurred', 'error');
      }
    });
  }
  
   /**
   * Resets the form
   */
   resetForm(): void {
    this.forgotPasswordForm.reset();
    this.forgotPasswordForm.markAsPristine();
    this.forgotPasswordForm.markAsUntouched();
  }

  /**
   * Handles cancel action
   */
  onCancel(): void {
    this.resetForm();
    this.isFormSubmitted = true;
  }

  /**
   * Displays a snackbar notification
   */
  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }

  /**
 * Handles the resolved CAPTCHA and stores the token.
 * @param token - The token received from reCAPTCHA
 */
  onCaptchaResolved(token: string): void {
    this.captchaToken = token;
  }

}
