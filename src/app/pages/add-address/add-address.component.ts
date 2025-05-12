import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/model/address';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit{

  addAddressForm!: FormGroup;
  userId!: number;
  isSuperAdmin = false;
  isAdmin = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['userId'];
    this.initializeForm();
    this.initializeRoles();
  }

  private initializeForm(): void {
    this.addAddressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  private initializeRoles(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
      this.isAdmin = this.authService.isAdminUser(userInfo);
    }
  }

  onSubmit(): void {
    if (this.addAddressForm.invalid) return;

    const address: Address = this.addAddressForm.value;

    this.userService.addAddress(address, this.userId).subscribe({
      next: (response) => {
        this.showMessage(response.message);
        this.addAddressForm.reset();
        this.navigateToAllAddresses();
      },
      error: (error) => {
        this.showMessage(error.error.errorMessage);
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
