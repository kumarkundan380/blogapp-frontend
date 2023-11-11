import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/model/role';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles:any = new FormControl('');
  roleList!: Role[];
  userId!: number;
  useUpdatedRole!: Role[];
  userRole!: Role[];
  roleIds!: number[];
  roleName!: string[];
  haveUserRole!: boolean;



  constructor(private userService: UserService,
    private router: Router,
    private activateRoute: ActivatedRoute, 
    private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.params['userId'];
    this.getAllRoles();
    this.getUserRole();
  }

  getAllRoles(){
    this.userService.getAllRoles().subscribe({
      next: (data) => {
        this.roleList = data.body.map(role => role);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  getUserRole(){
    this.userService.getUser(this.userId).subscribe({
      next: (data) => {
        this.userRole = data.body?.roles!.map(role => role);
        this.roles.setValue(this.userRole);
        this.roleIds = this.userRole.map(role => role.roleId!);
        this.roleName = this.userRole.map(role => role.roleName);
        this.haveUserRole = this.roleName.includes("USER");
        this.roleList = this.roleList.filter(role => !this.roleIds.includes(role.roleId!));
        this.roleList = this.roleList.concat(this.userRole);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })

  }

  selectRole(){
    this.roleName = this.roles.value!.map((role: { roleName: string; }) => role.roleName);
    this.haveUserRole = this.roleName.includes("USER");
  }


  onSubmit(){
    this.userService.updateRoles(this.userId,this.roles.value!).subscribe({
      next: (data) => {
        this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.router.navigate(['/admin/profile'])
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
