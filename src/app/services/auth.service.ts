import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BlogAppResponse } from '../model/blogapp-response';
import { LoginRequest } from '../model/login-request';
import { LoginResponse } from '../model/login-response';
import { Role } from '../model/role';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_URL = `${environment.apiBaseUrl}/auth`; 

  logInStatusSubject = new BehaviorSubject<boolean>(false);
  profileImageSubject = new BehaviorSubject<string>("../../../assets/profile.png");
  showLoginButtonSubject = new BehaviorSubject<boolean>(true);
  showSignupButtonSubject = new BehaviorSubject<boolean>(true);
  userInfoSubject = new BehaviorSubject<User | null>(null);
  

  constructor(private httpClient: HttpClient) { }

  /**
   * Logs in the user and stores access & refresh tokens.
   */
  loginUser(loginRequest: LoginRequest): Observable<BlogAppResponse<LoginResponse>> {
    return this.httpClient.post<BlogAppResponse<LoginResponse>>(`${this.BASE_URL}/login`, loginRequest).pipe(
      tap(response => {
        if (response.body) {
          this.setUserInfo(response.body);
          this.logInStatusSubject.next(true);
          this.userInfoSubject.next(response?.body?.user);
        }
      })
    );
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  refreshAccessToken(): Observable<BlogAppResponse<LoginResponse>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return new Observable();
    }
    return this.httpClient.post<BlogAppResponse<LoginResponse>>(
      `${this.BASE_URL}/refresh-token`,
      {},  // Empty body since the backend expects token in header
      {
        headers: { Authorization: `Bearer ${refreshToken}` } // Send refresh token in header
      }
    ).pipe(
      tap(response => {
        if (response.body?.accessToken) {
          this.setAccessToken(response.body.accessToken);
        }
      })
    );
  }

  /**
   * Stores user authentication details in local storage.
   */
  public setUserInfo(loginResponse: LoginResponse): void {
    this.setAccessToken(loginResponse.accessToken);
    this.setRefreshToken(loginResponse.refreshToken);
    this.setUser(loginResponse.user);
    this.userInfoSubject.next(loginResponse?.user);
  }

  public setAccessToken(token: string): void {
    localStorage.setItem("accessToken", JSON.stringify(token));
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem("refreshToken", JSON.stringify(token));
  }

  public setUser(user: User): void {
    localStorage.setItem("userInfo", JSON.stringify(user));
  }

  /**
   * Checks if the user is logged in.
  */
  isLoggedIn(): boolean {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) !== null : false;
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      return false;
    }
  }

  /**
   * Retrieves the stored access token.
   */
  getAccessToken(): string | null {
    const token = localStorage.getItem("accessToken");
    return token ? JSON.parse(token) : null;
  }

  /**
   *Retrieves the stored refresh token.
  */
  getRefreshToken(): string | null {
    const token = localStorage.getItem("refreshToken");
    return token ? JSON.parse(token) : null;
  }

  /**
   * Retrieves the stored user information.
   */
  getUserInfo(): User | null {
    const user = localStorage.getItem("userInfo");
    return user ? JSON.parse(user) : null;
  }

  /**
   * Logs the user out and clears stored data.
   */
  logout(): void {
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    this.logInStatusSubject.next(false);
  }

   /**
   * Checks if the user has super admin role.
   */
  isSuperAdminUser(user: User): boolean {
    return user?.roles?.some((role: Role) => role.roleName === 'SUPER ADMIN') || false;
  }

  /**
   * Checks if the user has an admin role.
   */
  isAdminUser(user: User): boolean {
    return user?.roles?.some((role: Role) => role.roleName === 'ADMIN') || false;
  }

   /**
   * Checks if the user has an moderate role.
   */
   isModerateUser(user: User): boolean {
    return user?.roles?.some((role: Role) => role.roleName === 'MODERATE') || false;
  }

  /**
   * Checks if the current user is the same as the provided user ID.
   */
  isSameUser(userId: number): boolean {
    return this.getUserInfo()?.userId === userId;
  }

}
