import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BlogappResponse } from '../model/blogapp-response';
import { LoginRequest } from '../model/login-request';
import { LoginResponse } from '../model/login-response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = "http://localhost:8080/api/v1/auth";
  logInStatusSubject = new Subject<boolean>();

  constructor(private httpClient: HttpClient) { }

  loginUser(loginRequest : LoginRequest): Observable<BlogappResponse<LoginResponse>> {
    return this.httpClient.post<BlogappResponse<LoginResponse>>(`${this.BASE_URL}/login`, loginRequest);
  }

  setUserInfo(user: any): void{
    localStorage.setItem("userInfo", JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    let userInfo = localStorage.getItem("userInfo");
    if(userInfo == undefined || userInfo =='' || userInfo ==null){
      return false;
    }
    return true;
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem("userInfo") || '{}').token;
  }

  getUserInfo(): User {
    return JSON.parse(localStorage.getItem("userInfo") || '{}').user;
  }

  logout(): void {
    localStorage.removeItem("userInfo");
  }

  isAdminUser(user:any): boolean {
    const role = user.roles.find((role: any) => role?.roleName ==='ADMIN');
    if(role === undefined || role === '' || role === null){
      return false;
    }
    return true;

  }
}
