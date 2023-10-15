import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/model/address';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit{

  addAddressForm!: FormGroup;
  user!: User;
  address!: Address;
  userId!:number;

  constructor(private userService : UserService, 
    private activateRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.params['userId'];
    this.addAddressForm = this.formBuilder.group({
      addressLine1: new FormControl('',Validators.required),
	    addressLine2: new FormControl(''),
	    city: new FormControl('', Validators.required),
	    state: new FormControl('', Validators.required),
	    country: new FormControl('',Validators.required),
	    postalCode: new FormControl('',Validators.required),
    });
  }

  onSubmit(){
    this.address = {
      addressLine1:this.addAddressForm.get('addressLine1')?.value,
      addressLine2:this.addAddressForm.get('addressLine2')?.value,
      city:this.addAddressForm.get('city')?.value,
      state:this.addAddressForm.get('state')?.value,
      country:this.addAddressForm.get('country')?.value,
      postalCode:this.addAddressForm.get('postalCode')?.value,
    }
    this.addAddress(this.userId);
  }

  addAddress(userId:number){
    this.userService.addAddress(this.address,userId).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.addAddressForm.reset();
        this.router.navigate([`all-address/${userId}`])
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
