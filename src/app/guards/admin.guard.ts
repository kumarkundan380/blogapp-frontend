import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  
  constructor(private authService: AuthService, private router: Router) { }
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isLoggedIn()) {
      if(this.authService.isAdminUser(this.authService.getUserInfo())){
        return true;
      }
      this.router.navigate(['\login']);
      return false;
    }
    this.router.navigate(['\login']);
    return false;
  }
  
}
