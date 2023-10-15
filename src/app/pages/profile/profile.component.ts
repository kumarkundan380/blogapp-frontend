import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId!: number;
  user!: User;
  userImage:string = "../../../assets/profile.png";

  constructor(private userService : UserService, 
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar){ 
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserInfo().userId!;
    this.userService.getUser(this.userId!).subscribe({
      next: (data) => {
        this.user = data.body
        if(data.body.userImage){
          this.userImage = data.body.userImage;
        }
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  updateUser(){
    this.router.navigate([`/update-user/${this.userId}`]);
  }

  allAddress(){
    this.router.navigate([`/all-address/${this.userId}`]);
  }

  getFullName(user: User):string {
    let fullName = "";
    if(user.firstName) {
      fullName+=user.firstName;
    }
    if(user.middleName) {
      fullName+=" "+user.middleName;
    }
    if(user.lastName) {
      fullName+=" "+user.lastName;
    }
    return fullName;
  }


}
