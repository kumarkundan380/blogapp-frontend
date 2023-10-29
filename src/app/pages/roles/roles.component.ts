import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/model/role';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roleList:any = new FormControl('');
  updateRole!: FormGroup;
  userId!: number;
  roles! :Role[];

  constructor(private userService: UserService,
    private activateRoute: ActivatedRoute, 
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.params['userId'];
    this.updateRole = this.formBuilder.group({
      roleList: new FormControl('')
    });
    this.getAllRoles();
  }

  getAllRoles(){
    this.userService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data.body.map(role => role);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }


  onSubmit(){
    console.log(this.roles);
    console.log(this.roleList.value?.[0]);
    console.log(typeof(this.roleList.value?.[0]));
    console.log(this.roleList.value?.[0]?.['roleName']);

    this.userService.updateRoles(this.userId,this.roleList.value).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
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
