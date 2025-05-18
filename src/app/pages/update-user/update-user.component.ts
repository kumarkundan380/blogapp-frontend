import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender, User, UserStatus } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  updateUserForm!: FormGroup;
  userId!: number;
  file?: File;
  imageSrc: string | ArrayBuffer | null = "../../../assets/profile.png";
  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  userStatuses = Object.values(UserStatus);
  genders = Object.values(Gender);
  originalUser!: User;
  formChanged = false;
  selectedFileName: string = '';


  constructor(private activateRoute: ActivatedRoute,
    private authService : AuthService,
    private userService : UserService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar){}

  ngOnInit(): void {

    this.userId = +this.activateRoute.snapshot.params['userId'];
    const useInfo = this.authService.getUserInfo()!;
    this.isSuperAdmin = this.authService.isSuperAdminUser(useInfo);
    this.isAdmin = this.authService.isAdminUser(useInfo);

     // Initialize Form
     this.initializeForm();

     // Fetch User Data
    this.userService.getUser(this.userId).subscribe({
      next: (response) => {
        this.originalUser = response.body;
        this.populateForm(response.body)
      },
      error: (error) => this.showSnackbar(error.error.errorMessage)
    });

  }

  // Initialize the form with validation
  private initializeForm(): void {
    
    this.updateUserForm = this.formBuilder.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      middleName: [''],
      lastName: [''],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      about: ['', Validators.required],
      ...((this.isSuperAdmin || this.isAdmin) && { 
        status: ['', Validators.required],
        emailVerified: ['', Validators.required]
      })
    });
  }

   // Populate form fields with user data
   private populateForm(user: User): void {
    
    if (!user) return;

    this.updateUserForm.patchValue({
      userName: user.userName,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      about: user.about,
      ...((this.isSuperAdmin || this.isAdmin) && {
        status: user.status,
        emailVerified: user.emailVerified ? "YES" : "NO"
      })
    });

    this.updateUserForm.valueChanges.subscribe(() => {
      this.formChanged = !this.isFormUnchanged();
    });

      // Set Profile Image
    if (user?.userImage) {
      this.imageSrc = user.userImage;
    }
  }

   // Handle file selection
   onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
      this.selectedFileName = this.file.name;
      const reader = new FileReader();
      reader.onload = (e) => this.imageSrc = e.target?.result ?? null;
      reader.readAsDataURL(this.file);
    } else {
      this.file = undefined;
      this.imageSrc = null;
    }
    // File selection counts as a change
    this.formChanged = true;
  }

  // Handle form submission
  onSubmit(): void {
    
    if (this.updateUserForm.invalid) return;

    // If no changes made and no new file uploaded, don't submit
    if (this.isFormUnchanged() && !this.file) {
      this.showSnackbar("No meaningful changes detected.");
      return;
    }

    const updatedUser: User = {
      ...this.updateUserForm.value,
      emailVerified: (this.isSuperAdmin || this.isAdmin) ? this.updateUserForm.get('emailVerified')?.value === "YES" : undefined
    };

    this.userService.updateUser(updatedUser, this.userId, this.file).subscribe({
      next: (response) => this.handleSuccess(response.body),
      error: (error) => this.showSnackbar(error.error.errorMessage)
    });
  }

  private isFormUnchanged(): boolean {
    
    const formValue = this.updateUserForm.value;
  
    const trim = (val: any) => typeof val === 'string' ? val.trim() : val;
  
    const updatedUser: Partial<User> = {
      userName: trim(formValue.userName),
      email: trim(formValue.email),
      firstName: trim(formValue.firstName),
      middleName: trim(formValue.middleName),
      lastName: trim(formValue.lastName),
      phoneNumber: trim(formValue.phoneNumber),
      gender: trim(formValue.gender),
      about: trim(formValue.about),
      ...((this.isSuperAdmin || this.isAdmin) && {
        status: trim(formValue.status),
        emailVerified: formValue.emailVerified === "YES"
      })
    };
  
    const originalUser = {
      userName: this.originalUser.userName,
      email: this.originalUser.email,
      firstName: this.originalUser.firstName,
      middleName: this.originalUser.middleName,
      lastName: this.originalUser.lastName,
      phoneNumber: this.originalUser.phoneNumber,
      gender: this.originalUser.gender,
      about: this.originalUser.about,
      ...((this.isSuperAdmin || this.isAdmin) && {
        status: this.originalUser.status,
        emailVerified: this.originalUser.emailVerified
      })
    };
  
    // Compare JSON stringified versions
    return JSON.stringify(updatedUser) === JSON.stringify(originalUser);
  }

  resetForm(): void {
    if (!this.originalUser) return;
  
    this.updateUserForm.patchValue({
      userName: this.originalUser.userName,
      firstName: this.originalUser.firstName,
      middleName: this.originalUser.middleName,
      lastName: this.originalUser.lastName,
      email: this.originalUser.email,
      phoneNumber: this.originalUser.phoneNumber,
      gender: this.originalUser.gender,
      about: this.originalUser.about,
      ...((this.isSuperAdmin || this.isAdmin) && {
        status: this.originalUser.status,
        emailVerified: this.originalUser.emailVerified ? "YES" : "NO"
      })
    });
    this.file = undefined;
    this.imageSrc = this.originalUser.userImage ?? "../../../assets/profile.png";
    this.selectedFileName = '';
    this.updateUserForm.markAsPristine();
    this.updateUserForm.markAsUntouched();
  }

  // Handle successful update
  private handleSuccess(updatedUser: User): void {
    if (this.authService.isSameUser(updatedUser.userId!)) {
      this.authService.setUser(updatedUser);
      if (updatedUser.userImage) {
        this.authService.profileImageSubject.next(updatedUser.userImage);
      }
    }
    
    this.showSnackbar("User updated successfully!");
    this.updateUserForm.reset();
    this.router.navigate([(this.isSuperAdmin || this.isAdmin) ? `/admin/profile/${this.userId}` : `/profile/${this.userId}`]);
  }

   // Show snack bar notification
   private showSnackbar(message: string): void {
    
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

   // Navigate to role update page
   updateRole(): void {
    
    this.router.navigate([`/admin/${this.userId}/roles`]);
  }

  // Navigate to address update page
  updateAddress(): void {
    
    if(this.isSuperAdmin || this.isAdmin) {
      this.router.navigate([`/admin/all-address/${this.userId}`]);
    } else {
      this.router.navigate([`/all-address/${this.userId}`]);
    }
  }

}
