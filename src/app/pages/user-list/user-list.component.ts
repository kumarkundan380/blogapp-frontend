import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogappPageableResponse } from 'src/app/model/blogapp-pageable-response';
import { User } from 'src/app/model/user';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{

  users!: BlogappPageableResponse<User[]>;
  userStatus!:string;
  roleList!:string[];
  dialogSubscription!: Subscription;

  constructor(private userService : UserService, 
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService){ 
  }
  
  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    this.userService.getAllUser().subscribe({
      next: (data) => {
        this.users = data.body;
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
      }
    )
  }

  onPageChange(pageNumber: number): void {
    this.userService.getAllUser(pageNumber).subscribe({
      next: (data) =>{
        this.users = data.body
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
  }

  updateUser(user:User){
    this.router.navigate([`/update-user/${user.userId}`]);
  }

  updateRole(user:User){
    this.roleList = user?.roles?.map(role => role?.roleName)!;
    this.userService.userRoles.next(this.roleList);
    this.router.navigate([`/admin/${user.userId}/update-role`]);
  }

  deleteUser(user:User) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe((res: boolean) =>{
      if(res){
        this.userService.deleteUser(user.userId!).subscribe({
          next: (data) => {
            this._snackBar.open(data.message, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
            this.getUser();
          },
          error: (error) => {
            this._snackBar.open(error.error.errorMessage, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
          }
        });
      }
    });
  }  

  getFullName(user: User){
    let fullName = user.firstName;
    if(user.middleName) {
      fullName+=" "+user.middleName;
    }
    if(user.lastName){
      fullName+=" "+user.lastName;
    }
    return fullName;
  }


}
