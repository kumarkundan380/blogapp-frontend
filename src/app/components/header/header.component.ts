import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  userName: string = '';
  backgroundImage:string = '../../../assets/profile.png';
  logInSubscription!:Subscription
  
   constructor(public authService : AuthService, private router : Router){}
  
  

  ngOnInit(): void {
    this.logInSubscription = this.authService.logInStatusSubject.asObservable().subscribe(data => {
      this.isLoggedIn = data;
      if(this.isLoggedIn){
        this.userName = this.authService.getUserInfo().userName;
      }
    });
    this.isLoggedIn = this.authService.isLoggedIn();
    if(this.isLoggedIn){
      this.userName = this.authService.getUserInfo().userName;
    }
    if(this.authService.getUserInfo()?.userImage) {
      this.backgroundImage = this.authService.getUserInfo().userImage!;
    }
  }

  logOut():void {
    this.authService.logout();
    this.authService.logInStatusSubject.next(false);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.logInSubscription.unsubscribe();
  }


}
