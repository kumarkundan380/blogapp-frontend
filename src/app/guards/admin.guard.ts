import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  
  constructor(private authService: AuthService, private router: Router) { }
  
  canActivate(): boolean | UrlTree {
    return this.checkAccess();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkAccess();
  }

  canLoad(): boolean {
    return this.authService.isLoggedIn() && (this.authService.isAdminUser(this.authService.getUserInfo()!) || this.authService.isSuperAdminUser(this.authService.getUserInfo()!));
  }
  
  private checkAccess(): boolean | UrlTree {
    return this.authService.isLoggedIn() && (this.authService.isAdminUser(this.authService.getUserInfo()!) || this.authService.isSuperAdminUser(this.authService.getUserInfo()!)) 
      ? true 
      : this.router.createUrlTree(['/login']);
  }
  
}
