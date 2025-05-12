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

  adminInfo: AdminInfo;

  constructor(private adminService : AdminService, 
    private snackBar: MatSnackBar){
      this.adminInfo = {
        numberOfUsers: 0,
        numberOfActiveUsers: 0,
        numberOfPendingUsers: 0,
        numberOfDeletedUsers: 0,
        numberOfPosts: 0,
        numberOfActivePosts: 0,
        numberOfPendingPosts: 0,
        numberOfDeletedPosts: 0,
        numberOfCategories: 0,
        numberOfActiveCategories: 0,
        numberOfPendingCategories: 0,
        numberOfDeletedCategories: 0
      };
  }

  ngOnInit(): void {

    this.fetchAdminInfo();
    
  }

  /**
   * Fetches admin dashboard information.
   */
  private fetchAdminInfo(): void {
    this.adminService.getAdminInfo().subscribe({
      next: (response) => {this.adminInfo = response.body;console.log(response.body)},
      error: (error) => this.showError(error)
    });
  }

  /**
   * Displays an error message in a snackbar.
   * @param error - The error response
   */
  private showError(error: any): void {
    const errorMessage = error?.error?.message || 'Failed to load admin info';
    this.snackBar.open(errorMessage, 'OK', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
