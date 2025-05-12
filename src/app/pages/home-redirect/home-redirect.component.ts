import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-redirect',
  templateUrl: './home-redirect.component.html',
  styleUrls: ['./home-redirect.component.css']
})
export class HomeRedirectComponent {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
    const user: User = this.authService.getUserInfo()!; // Fetch from localStorage or token
    if (this.authService.isSuperAdminUser(user) || this.authService.isAdminUser(user)) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/posts']); // PostsComponent
    }
  }

}
