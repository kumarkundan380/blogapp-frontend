import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  isLoggedIn!:boolean;
  isAdmin!: boolean;
  showLoginButton!:boolean;
  showSignupButton!:boolean;
  userName!:string;
  profileImage!:string;
  logInSubscription!:Subscription
  profileImageSubscription!:Subscription;
  
  constructor(public authService : AuthService, private router : Router){}
  

  ngOnInit(): void {
    // this.logInSubscription = this.authService.logInStatusSubject.asObservable().subscribe(data => {
    //   this.isLoggedIn = data;
    //   if(this.isLoggedIn){
    //     this.userName = this.authService.getUserInfo().userName;
    //   }
    // });
    this.authService.showLoginButtonSubject.subscribe(data => {
      this.showLoginButton=data
    })
    this.authService.showSignupButtonSubject.subscribe(data => {
      this.showSignupButton = data;
    })
    this.authService.logInStatusSubject.subscribe(data => {
      this.isLoggedIn = data;
      if(this.isLoggedIn){
        this.userName = this.authService.getUserInfo().userName;
      }
    });
    this.isLoggedIn = this.authService.isLoggedIn();
    // this.profileImageSubscription = this.authService.profileImageSubject.asObservable().subscribe(data => {
    //   this.profileImage = data;
    // })
    this.authService.profileImageSubject.subscribe(data => {
      this.profileImage = data;
    })
    if(this.isLoggedIn){
      this.userName = this.authService.getUserInfo().userName;
    }
    if(this.authService.getUserInfo()?.userImage) {
      this.profileImage = this.authService.getUserInfo().userImage!;
    }
    this.isAdmin = this.authService.isAdminUser(this.authService.getUserInfo());
  }

  goToHomePage() {
    if(this.isAdmin) {
      this.router.navigate([`/admin`])
    } else {
      this.router.navigate(['/']);
    }
  }

  logOut():void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.authService.logInStatusSubject.next(this.isLoggedIn);
    this.authService.profileImageSubject.next(this.profileImage);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.router.navigate(['/']);
  }

  logIn(){
    this.authService.showLoginButtonSubject.next(false);
    this.router.navigate([`/login`])
  }

  signUp() {
    this.authService.showSignupButtonSubject.next(false);
    this.router.navigate(['/signup']);
  }

  ngOnDestroy(): void {
    this.authService.showSignupButtonSubject.next(true);
    this.authService.showLoginButtonSubject.next(true);
  }


}
