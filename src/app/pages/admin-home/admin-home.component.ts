import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminInfo } from 'src/app/model/adminInfo';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  adminInfo!: AdminInfo;

  constructor(private adminService : AdminService, 
    private _snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
    this.adminService.getAdminInfo().subscribe({
      next: (data) => {
        this.adminInfo = data.body; 
      },
      error:(error) => {
        this._snackBar.open(error.error?.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

}
