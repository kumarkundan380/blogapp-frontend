import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  isLoggedIn = false;
  isAdmin = false;
  isSuperAdmin = false;
  showLoginButton = true;
  showSignupButton = true;
  userName = '';
  profileImage = '';
  userId!: number;

  private subscriptions: Subscription = new Subscription();

  @Output() sidebarToggle = new EventEmitter<void>();
  
  constructor(public authService : AuthService, private router : Router, private themeService: ThemeService){}
  
  ngOnInit(): void {
    this.initializeAuthSubscriptions();
    this.loadInitialUserInfo();
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit(); // Notify parent to toggle sidebar
    this.goToHomePage();
  }

  private initializeAuthSubscriptions(): void {
    this.subscriptions.add(
      this.authService.showLoginButtonSubject.subscribe(show => {
        this.showLoginButton = show;
      })
    );

    this.subscriptions.add(
      this.authService.showSignupButtonSubject.subscribe(show => {
        this.showSignupButton = show;
      })
    );

    this.subscriptions.add(
      this.authService.logInStatusSubject.subscribe(status => {
        this.isLoggedIn = status;
        if (this.isLoggedIn) {
          const userInfo = this.authService.getUserInfo();
          if (userInfo) {
            this.userName = userInfo.userName;
            this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
            this.isAdmin = this.authService.isAdminUser(userInfo);
          }
        } else {
          this.resetUserInfo();
        }
      })
    );

    this.subscriptions.add(
      this.authService.profileImageSubject.subscribe(image => {
        this.profileImage = image;
      })
    );
  }

  private loadInitialUserInfo(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const userInfo = this.authService.getUserInfo();
    this.userId = userInfo?.userId!;
    if (this.isLoggedIn && userInfo) {
      this.userName = userInfo.userName;
      this.isAdmin = this.authService.isAdminUser(userInfo);
      this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
      this.profileImage = userInfo.userImage ?? '';
    }
  }

  private resetUserInfo(): void {
    this.userName = '';
    this.profileImage = '';
    this.isAdmin = false;
    this.isSuperAdmin = false;
  }

  goToHomePage(): void { 
    if (this.isLoggedIn && (this.isSuperAdmin || this.isAdmin)) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/posts']);
    }
  }

  goToProfilePage(): void {
    const userInfo = this.authService.getUserInfo();
    if (this.isLoggedIn) { 
      if(this.isSuperAdmin || this.isAdmin) {
        this.router.navigate([`/admin/profile/${userInfo?.userId}`]);
      } else {
        this.router.navigate([`/profile/${userInfo?.userId}`]);
      }  
    } else {
      this.router.navigate(['/posts']);
    }
  }

  goToAboutUsPage(): void {
    this.router.navigate([`/about-us`]);
  }

  goToContactUsPage(): void {
    this.router.navigate(['/contact-us']);
  }

  logOut(): void {
    this.authService.logout();
    this.resetUserInfo();
    this.isLoggedIn = false;

    // Update observables for the rest of the app
    this.authService.logInStatusSubject.next(false);
    this.authService.profileImageSubject.next('');

    this.router.navigate(['/posts']);
  }

  logIn(): void {
    this.authService.showLoginButtonSubject.next(false);
    this.router.navigate(['/login']);
  }

  signUp(): void {
    this.authService.showSignupButtonSubject.next(false);
    this.router.navigate(['/signup']);
  }

  ngOnDestroy(): void {
    // Reset buttons to default state
    this.authService.showSignupButtonSubject.next(true);
    this.authService.showLoginButtonSubject.next(true);

    // Clean up all subscriptions
    this.subscriptions.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDark(): boolean {
    return this.themeService.isDarkTheme();
  }

}
