import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard  {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // const useInfo = this.authService.getUserInfo()!;
    // const isSuperAdmin = this.authService.isSuperAdminUser(useInfo);
    // const isAdmin = this.authService.isAdminUser(useInfo);
    // if (this.authService.isLoggedIn()) {
    //   if(isSuperAdmin || isAdmin){
    //     this.router.navigate(['/admin']);
    //   } else {
    //     this.router.navigate(['/posts']);
    //   }
    //   return false;
    // }
    // return true;
    if (this.authService.isLoggedIn()) {
      const useInfo = this.authService.getUserInfo();
      const isSuperAdmin = useInfo && this.authService.isSuperAdminUser(useInfo);
      const isAdmin = useInfo && this.authService.isAdminUser(useInfo);
      
      if (isSuperAdmin || isAdmin) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/posts']);
      }
      return false;
    }
    return true;
  }

}

