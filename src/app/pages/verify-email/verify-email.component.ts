import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyEmail } from 'src/app/model/verify-email';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  token!: string;
  verifyEmail!: VerifyEmail;

  constructor(private activateRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private _snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.token = this.activateRoute.snapshot.params['token'];
  }

  emailVerify(){
    this.verifyEmail = {
      token: this.token
    }

    this.userService.verifyEmail(this.verifyEmail).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
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
