import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/model/address';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {

  editAddressForm!: FormGroup;
  userId!: number;
  addressId!: number;
  isSuperAdmin = false;
  isAdmin = false;
  address!: Address;
  formChanged = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeRoles();
    this.initializeForm();
    this.fetchAddressData();
  }

  private initializeRoles(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
      this.isAdmin = this.authService.isAdminUser(userInfo);
    }
  }

  private initializeForm(): void {

    this.editAddressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  private fetchAddressData(): void {
    this.userId = +this.route.snapshot.params['userId'];
    this.addressId = +this.route.snapshot.params['addressId'];

    this.userService.getOneAddress(this.userId, this.addressId).subscribe({
      next: (response) => {
        this.address = response.body;
        this.populateForm(response.body);
      },
      error: (error) => {
        this.showMessage(error.error?.errorMessage);
      }
    });
  }

  onSubmit(): void {

    if (this.editAddressForm.invalid) {
      return;
    }
    if (this.isFormUnchanged()) {
      this.showMessage("No meaningful changes detected.");
      return;
    }
    const updatedAddress: Address = this.editAddressForm.value;
    this.updateAddress(updatedAddress);
  }

  // Populate form fields with user data
  private populateForm(adress: Address): void {
    
    if (!adress) return;

  //  this.editAddressForm.patchValue(adress);
    this.editAddressForm.patchValue({
      addressLine1: adress.addressLine1,
      addressLine2: adress.addressLine2,  
      city: adress.city,
      state: adress.state,
      country: adress.country,
      postalCode: adress.postalCode
    });

    this.editAddressForm.valueChanges.subscribe(() => {
      this.formChanged = !this.isFormUnchanged();
    });
  }

  private isFormUnchanged(): boolean {
    
    const formValue = this.editAddressForm.value;
  
    const trim = (val: any) => typeof val === 'string' ? val.trim() : val;
  
    const updatedAddress: Partial<Address> = {
      addressLine1: trim(formValue.addressLine1),
      addressLine2: trim(formValue.addressLine2),
      city: trim(formValue.city),
      state: trim(formValue.state),
      country: trim(formValue.country),
      postalCode: trim(formValue.postalCode),
    };
  
    const originalAddress = {
      addressLine1: this.address.addressLine1,
      addressLine2: this.address.addressLine2,
      city: this.address.city,
      state: this.address.state,
      country: this.address.country,
      postalCode: this.address.postalCode
    };
  
    // Compare JSON stringified versions
    return JSON.stringify(updatedAddress) === JSON.stringify(originalAddress);
  }

  resetForm(): void {
    
    if (!this.address) return;
  
    this.editAddressForm.patchValue({
      addressLine1: this.address.addressLine1,
      addressLine2: this.address.addressLine2,
      city: this.address.city,
      state: this.address.state,
      country: this.address.country,
      postalCode: this.address.postalCode
    });
    this.editAddressForm.markAsPristine();
    this.editAddressForm.markAsUntouched();
  }
  

  private updateAddress(address: Address): void {
    this.userService.updateAddress(this.userId, this.addressId, address).subscribe({
      next: (response) => {
        this.showMessage(response.message);
        this.editAddressForm.reset();
        this.navigateToAllAddresses();
      },
      error: (error) => {
        this.showMessage(error.error?.errorMessage);
      }
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  private navigateToAllAddresses(): void {
    const routePath = this.isSuperAdmin || this.isAdmin
      ? `/admin/all-address/${this.userId}`
      : `/all-address/${this.userId}`;
    this.router.navigate([routePath]);
  }

}
