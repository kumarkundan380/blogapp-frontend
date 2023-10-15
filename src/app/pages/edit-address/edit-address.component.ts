import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/model/address';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {

  userId!: number;
  addressId!: number;
  address!: Address
  editAddressForm!: FormGroup;
  constructor(private activateRoute: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router){ }
  

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.params['userId'];
    this.addressId = this.activateRoute.snapshot.params['addressId'];
    this.userService.getOneAddress(this.userId,this.addressId).subscribe({
      next: (data) => {
        this.address = data.body;
        this.editAddressForm.patchValue({
          addressId:this.address.addressId,
          addressLine1:this.address.addressLine1,
          addressLine2:this.address.addressLine2,
          city:this.address.city,
          state:this.address.state,
          country:this.address.country,
          postalCode:this.address.postalCode
        });
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
    this.editAddressForm = this.formBuilder.group({
      addressId: new FormControl('', Validators.required),
	    addressLine1: new FormControl('', Validators.required),
	    addressLine2: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
	    state: new FormControl('', Validators.required),
      country: new FormControl('',Validators.required),
      postalCode: new FormControl('', Validators.required),
    });
  }

  onSubmit(){
    this.address = {
      addressId:this.editAddressForm.get('addressId')?.value,
      addressLine1:this.editAddressForm.get('addressLine1')?.value,
      addressLine2:this.editAddressForm.get('addressLine2')?.value,
      city:this.editAddressForm.get('city')?.value,
      state:this.editAddressForm.get('state')?.value,
      country:this.editAddressForm.get('country')?.value,
      postalCode:this.editAddressForm.get('postalCode')?.value,
    }
    this.updateAddress(this.address,this.userId,this.addressId);
  }  

  updateAddress(address:Address, userId:number,addressId:number) {
    this.userService.updateAddress(userId,addressId,address).subscribe({
      next: (data) => {
        this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.editAddressForm.reset();
        this.router.navigate([`/all-address/${this.userId}`]);
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
