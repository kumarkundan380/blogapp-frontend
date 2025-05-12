import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {
  
  constructor(private authService: AuthService, private router: Router) { }
  
  canActivate(): boolean | UrlTree {
    return this.authService.isLoggedIn() 
      ? true 
      : this.router.createUrlTree(['/login']);
  }
  
}
