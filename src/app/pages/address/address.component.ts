import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/model/address';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  addressess: Address[] = [];
  userId!: number;
  dialogSubscription!: Subscription;
  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;

  constructor(private userService : UserService, 
    private activateRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService,
    private authService: AuthService){
  }

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.params['userId'];
    this.getAllAddress();
    const userInfo = this.authService.getUserInfo()!;
    this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
    this.isAdmin = this.authService.isAdminUser(userInfo);
  }

  getAllAddress(){
    this.userService.getAllAddressess(this.userId!).subscribe({
      next: (data) => {
        this.addressess = data.body
      },
      error: (error) => {
        this._snackBar.open(error.error?.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  deleteAddress(addressId:number) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe((res:boolean) =>{
      console.log('res..'+res)
      if(res){
        this.userService.deleteAddress(this.userId,addressId).subscribe({
          next: (data) => {
            this._snackBar.open(data.message, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
            this.getAllAddress();
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

  addAddress(){

    if(this.isSuperAdmin || this.isAdmin) {
      this.router.navigate([`/admin/add-address/${this.userId}`]);
    } else {
      this.router.navigate([`/add-address/${this.userId}`]);
    }  
  }

  editAddress(addressId:number){
    if(this.isSuperAdmin || this.isAdmin) {
      this.router.navigate([`/admin/edit-address/${this.userId}/${addressId}`]);
    } else {
      this.router.navigate([`/edit-address/${this.userId}/${addressId}`]);
    }  
  }




}
