import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  updateUserForm!: FormGroup;
  user!: User;
  userId!:number;
  selectedFile: File | null = null;
  file!:Blob;
  imageSrc: string | ArrayBuffer | null | undefined = null;
  isAdmin!:boolean;
  userVerified!:string;
  profileImage!:string;

  constructor(private activateRoute: ActivatedRoute,
    private authService : AuthService,
    private userService : UserService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
    this.imageSrc = "../../../assets/profile.png";
    this.profileImage = "../../../assets/profile.png";
    this.userId = this.activateRoute.snapshot.params['userId'];
    this.isAdmin = this.authService.isAdminUser(this.authService.getUserInfo());
    this.userService.getUser(this.userId).subscribe({
      next: (data) => {
        this.user = data.body;
        if(this.isAdmin){
          this.updateUserForm.patchValue({
            userName: this.user.userName,
            firstName: this.user.firstName,
            middleName: this.user.middleName,
            lastName: this.user.lastName,
            phoneNumber: this.user.phoneNumber,
            gender: this.user.gender,
            about: this.user.about,
            userStatus: this.user.userStatus,
            userVerified: this.user.isVerified?"YES":"NO",
          });
        } else {
          this.updateUserForm.patchValue({
            userName: this.user.userName,
            firstName: this.user.firstName,
            middleName: this.user.middleName,
            lastName: this.user.lastName,
            phoneNumber: this.user.phoneNumber,
            gender: this.user.gender,
            about: this.user.about,
          });
        }
        if(this.user.userImage){
          this.imageSrc = this.user.userImage;
          this.profileImage = this.user.userImage;
        }
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
    if(this.isAdmin){
      this.updateUserForm = this.formBuilder.group({
        userName: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        middleName: new FormControl(''),
        lastName: new FormControl(''),
        phoneNumber: new FormControl('', Validators.required),
        gender: new FormControl('',Validators.required),
        about: new FormControl('', Validators.required),
        userStatus: new FormControl('', Validators.required),
        userVerified: new FormControl('', Validators.required),
      });
    } else {
      this.updateUserForm = this.formBuilder.group({
        userName: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        middleName: new FormControl(''),
        lastName: new FormControl(''),
        phoneNumber: new FormControl('', Validators.required),
        gender: new FormControl('',Validators.required),
        about: new FormControl('', Validators.required),
      });
    }
    
  }

  onSubmit(){
    if(this.isAdmin){
      this.user = {
        userName:this.updateUserForm.get('userName')?.value,
        firstName:this.updateUserForm.get('firstName')?.value,
        middleName:this.updateUserForm.get('middleName')?.value,
        lastName:this.updateUserForm.get('lastName')?.value,
        phoneNumber:this.updateUserForm.get('phoneNumber')?.value,
        gender:this.updateUserForm.get('gender')?.value,
        about:this.updateUserForm.get('about')?.value,
        userStatus:this.updateUserForm.get('userStatus')?.value,
        isVerified:this.updateUserForm.get('userVerified')?.value=="YES"?true:false,
      }
    } else {
      this.user = {
        userName:this.updateUserForm.get('userName')?.value,
        firstName:this.updateUserForm.get('firstName')?.value,
        middleName:this.updateUserForm.get('middleName')?.value,
        lastName:this.updateUserForm.get('lastName')?.value,
        phoneNumber:this.updateUserForm.get('phoneNumber')?.value,
        gender:this.updateUserForm.get('gender')?.value,
        about:this.updateUserForm.get('about')?.value,
      }
    }
    this.updateUser();
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

  updateUser(){
    let formData = new FormData();
    formData.append("image", this.file);
    formData.append("userData",JSON.stringify(this.user));
    this.userService.updateUser(formData,this.userId).subscribe({
      next: (data) => {
          this.user = data.body;
          if(this.authService.isSameUser(data.body.userId!)){
            this.authService.setUser(JSON.stringify(data.body))
            if(data.body.userImage){
              this.authService.profileImageSubject.next(data.body.userImage!);
            }
            
          }
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.updateUserForm.reset();
        if(this.isAdmin){
          this.router.navigate(['/admin/profile']);
        } else{
          this.router.navigate(['/profile']);
        }
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
  }

  updateRole(){
    this.router.navigate([`/admin/${this.userId}/roles`]);
  }

  updateAddress(){
    this.router.navigate([`/all-address/${this.userId}`]);
  }


}
