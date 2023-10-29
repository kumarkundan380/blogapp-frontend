import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {

  signUpForm!: FormGroup;
  user!: User;
  selectedFile: File | null = null;
  file!:Blob;
  imageSrc: string | ArrayBuffer | null | undefined = null;

  constructor(private userService : UserService,
    private authService: AuthService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
    this.authService.showSignupButtonSubject.next(false);
    this.authService.showLoginButtonSubject.next(true);
    this.imageSrc = "../../../assets/logo.jpg";
    this.signUpForm = this.formBuilder.group({
      userName: new FormControl('',[Validators.required, Validators.email]),
	    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
	    firstName: new FormControl('', Validators.required),
	    middleName: new FormControl(),
	    lastName: new FormControl(),
	    phoneNumber: new FormControl(),
      gender: new FormControl('',Validators.required),
      about: new FormControl(),
    });
  }

  onSubmit(){
    this.user = {
      userName:this.signUpForm.get('userName')?.value,
      password:this.signUpForm.get('password')?.value,
      firstName:this.signUpForm.get('firstName')?.value,
      middleName:this.signUpForm.get('middleName')?.value,
      lastName:this.signUpForm.get('lastName')?.value,
      phoneNumber:this.signUpForm.get('phoneNumber')?.value,
      gender:this.signUpForm.get('gender')?.value,
      about:this.signUpForm.get('about')?.value,
    }
    this.registerUser();
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  registerUser(){
    let formData = new FormData();
    formData.append("image", this.file);
    formData.append("userData",JSON.stringify(this.user));
    this.userService.registerUser(formData).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.signUpForm.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
  }

  ngOnDestroy(): void {
    this.authService.showLoginButtonSubject.next(true);
  }

}

