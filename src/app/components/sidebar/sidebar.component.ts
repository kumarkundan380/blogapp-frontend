import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  isLoggedIn = false;
  isAdmin = false;
  isSuperAdmin = false;
  userInfo!:User;

  constructor(public authService : AuthService, private router : Router){}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userInfo = this.authService.getUserInfo()!;
    this.isAdmin = this.authService.isAdminUser(this.userInfo);
    this.isSuperAdmin = this.authService.isSuperAdminUser(this.userInfo);
  }

  goToProfilePage(): void {
    if(this.isLoggedIn) {
      if(this.isSuperAdmin || this.isAdmin) {
        this.router.navigate([`/admin/profile/${this.userInfo?.userId}`]);
      } else {
        this.router.navigate([`/profile/${this.userInfo?.userId}`]);
      }
    } else {
      this.router.navigate(['/']);
    }    
  }

  // Method to check if the current route is Profile related
  isProfileActive(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('/profile') || currentRoute.includes('/admin/profile');
  }

}
