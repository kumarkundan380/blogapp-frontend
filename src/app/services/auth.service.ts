import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogappResponse } from '../model/blogapp-response';
import { LoginRequest } from '../model/login-request';
import { LoginResponse } from '../model/login-response';
import { Role } from '../model/role';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = "http://localhost:8080/api/v1/auth";

  logInStatusSubject = new BehaviorSubject<boolean>(false);
  profileImageSubject = new BehaviorSubject<string>("../../../assets/profile.png");
  showLoginButtonSubject = new BehaviorSubject<boolean>(true);
  showSignupButtonSubject = new BehaviorSubject<boolean>(true);

  constructor(private httpClient: HttpClient) { }

  loginUser(loginRequest : LoginRequest): Observable<BlogappResponse<LoginResponse>> {
    return this.httpClient.post<BlogappResponse<LoginResponse>>(`${this.BASE_URL}/login`, loginRequest);
  }

  setUserInfo(loginResponse: LoginResponse): void {
    this.setToken(JSON.stringify(loginResponse.token));
    this.setUser(JSON.stringify(loginResponse.user));
  }

  setToken(token:string){
    localStorage.setItem("token", token);
  }

  setUser(user:string){
    localStorage.setItem("userInfo", user);
  }

  isLoggedIn(): boolean {
    let userInfo = localStorage.getItem("userInfo");
    if(userInfo == undefined || userInfo =='' || userInfo ==null){
      return false;
    }
    return true;
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem("token")!);
  }

  getUserInfo(): User {
    return JSON.parse(localStorage.getItem("userInfo")!);
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  }

  isAdminUser(user:User): boolean {
    const role = user.roles!.find((role: Role) => role?.roleName ==='ADMIN');
    if(role === undefined  || role === null){
      return false;
    }
    return true;

  }

  isSameUser(userId:number): boolean {
    if(this.getUserInfo().userId === userId){
      return true;
    }
    return false;
  }
}
