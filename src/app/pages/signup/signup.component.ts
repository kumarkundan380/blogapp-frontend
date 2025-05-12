import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Gender, User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { addressValidator } from 'src/app/validators/addressValidators';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {

  signUpForm!: FormGroup;
  file?: File;  // Optional file
  imageSrc: string | ArrayBuffer | null = "../../../assets/profile.png";
  hidePassword = true;
  selectedFileName: string = '';
  genders = Object.values(Gender);
  isDirty = false;

  constructor(private userService : UserService,
    private authService: AuthService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
    
    this.authService.showSignupButtonSubject.next(false);
    this.authService.showLoginButtonSubject.next(true);
    
    // Initialize Form
    this.signUpForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: [''],
      phoneNumber: [''],
      gender: ['', Validators.required],
      about: [''],
      // Addresses FormArray
      addresses: this.formBuilder.array([
        this.createAddressFormGroup()
      ])
    });
    
    this.signUpForm.valueChanges.subscribe(() => {
      this.isDirty = true;
    });
  }

  // Function to create an address FormGroup
  createAddressFormGroup(): FormGroup {

    const group = this.formBuilder.group({
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      country: [''],
      postalCode: ['']
    }, { validators: addressValidator() });
    
    // Re-run validator when any field changes
    group.valueChanges.subscribe(() => {
      group.updateValueAndValidity({ emitEvent: false }); // avoid loops
    });
    
    return group;
    
  }
  
  hasStartedFillingAddress(addressGroup: AbstractControl): boolean {
    const value = addressGroup.value || {};
    return Object.entries(value).some(
      ([key, val]) => typeof val === 'string' && val.trim() !== ''
    );
  }

  // Getter for addresses FormArray
  get addresses(): FormArray {
    return this.signUpForm.get('addresses') as FormArray;
  }


  // Function to add a new address field dynamically
  addAddress(): void {
    this.addresses.push(this.createAddressFormGroup());
  }

  // Function to remove an address
  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  /**
   * Handles file selection for profile picture upload.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.selectedFileName = this.file.name;
      const reader = new FileReader();
      reader.onload = (e) => this.imageSrc = e.target?.result ?? null;
      reader.readAsDataURL(this.file);
      this.isDirty = true;
    } else {
      this.file = undefined;
      this.imageSrc = null;
    }
  }

  /**
   * Handles form submission for user registration.
   */
  onSubmit(): void {
  
    if (this.signUpForm.invalid) return;

     // Remove address blocks that are completely empty
    const validAddresses = this.addresses.controls.filter(control => {
      const value = control.value as { [key: string]: any };
      return Object.values(value).some(val => typeof val === 'string' && val.trim() !== '');
    });

    this.signUpForm.setControl('addresses', this.formBuilder.array(validAddresses));
    
    const user: User = this.signUpForm.value;
    this.userService.registerUser(user, this.file).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, "OK", { duration: 3000, verticalPosition: 'top' });
        this.signUpForm.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.errorMessage || "Registration failed", "OK", { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  resetForm() {
    this.signUpForm.reset();
    this.selectedFileName = '';
    this.imageSrc = "../../../assets/profile.png";
    this.isDirty = false;
  }

  ngOnDestroy(): void {

    this.authService.showLoginButtonSubject.next(true);
  }
  

}

