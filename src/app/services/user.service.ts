import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../model/address';
import { BlogappPageableResponse } from '../model/blogapp-pageable-response';
import { BlogAppResponse } from '../model/blogapp-response';
import { ChangePassword } from '../model/change-password';
import { ForgotPassword } from '../model/forgot-password';
import { Role } from '../model/role';
import { User } from '../model/user';
import { UserSearchRequest } from '../model/user-search-request';
import { VerifyEmail } from '../model/verify-email';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BASE_URL = `${environment.apiBaseUrl}/users`; 
  private readonly BASE_URL_ROLES = `${environment.apiBaseUrl}/roles`; 
  
  userSubject = new Subject<User>();
  userRoles = new Subject<string[]>();

  constructor(private httpClient : HttpClient) { }

  registerUser(user: User, file?: File | null): Observable<BlogAppResponse<User>> {
    
    let formData = new FormData();
    // Append user details as JSON Blob
    formData.append("userDTO", new Blob([JSON.stringify(user)], { type: "application/json" }));
    // Append image file (if exists)
    if (file) {
      formData.append("image", file);
    }
    return this.httpClient.post<BlogAppResponse<User>>(`${this.BASE_URL}`, formData);
  }

  getUser(userId : number): Observable<BlogAppResponse<User>> {
    
    return this.httpClient.get<BlogAppResponse<User>>(`${this.BASE_URL}/${userId}`);
  }

  getAllUser(userSearchRequest: UserSearchRequest,pageNumber:number = 0, pageSize:number = 10): Observable<BlogAppResponse<BlogappPageableResponse<User[]>>>{
    
    return this.httpClient.post<BlogAppResponse<BlogappPageableResponse<User[]>>>(`${this.BASE_URL}/search-user?pageNumber=${pageNumber}&pageSize=${pageSize}`, userSearchRequest);
  }

  updateUser(user: User, userId: number, file?: File | null): Observable<BlogAppResponse<User>> {
  
    let formData = new FormData();
    // Append user details as JSON Blob
    formData.append("userDTO", new Blob([JSON.stringify(user)], { type: "application/json" }));
    // Append image file (if exists)
    if (file) {
      formData.append("image", file);
    }
    return this.httpClient.put<BlogAppResponse<User>>(`${this.BASE_URL}/${userId}`, formData);
  }
  

  getAllRoles(): Observable<BlogAppResponse<Role[]>> {
    return this.httpClient.get<BlogAppResponse<Role[]>>(`${this.BASE_URL_ROLES}`);
  }

  getRolesByUserId(userId: number): Observable<BlogAppResponse<Role[]>> {
    return this.httpClient.get<BlogAppResponse<Role[]>>(`${this.BASE_URL}/${userId}/roles`);
  }


  addRolesByUserId(userId:number,rolesList:Role[]): Observable<BlogAppResponse<Role[]>> {
    return this.httpClient.put<BlogAppResponse<Role[]>>(`${this.BASE_URL}/${userId}/roles`,rolesList);
  }

  removeRoleByUserId(userId:number,role:Role): Observable<BlogAppResponse<Role[]>> {
    return this.httpClient.put<BlogAppResponse<Role[]>>(`${this.BASE_URL}/${userId}/roles/remove`,role);
  }

  deleteUser(userId:number): Observable<BlogAppResponse<void>> {
    return this.httpClient.delete<BlogAppResponse<void>>(`${this.BASE_URL}/${userId}`,);
  }

  addAddress(address: Address, userId: number) : Observable<BlogAppResponse<User>> {
    return this.httpClient.post<BlogAppResponse<User>>(`${this.BASE_URL}/${userId}/addresses`, address);
  }

  getAllAddressess(userId: number) : Observable<BlogAppResponse<Address[]>> {
    return this.httpClient.get<BlogAppResponse<Address[]>>(`${this.BASE_URL}/${userId}/addresses`);
  }

  updateAddress(userId: number, addressId:number, address: Address) : Observable<BlogAppResponse<User>> {
    return this.httpClient.put<BlogAppResponse<User>>(`${this.BASE_URL}/${userId}/addresses/${addressId}`, address);
  }

  getUserAddress(userId: number, addressId:number) : Observable<BlogAppResponse<Address>> {
    return this.httpClient.get<BlogAppResponse<Address>>(`${this.BASE_URL}/${userId}/addresses/${addressId}`);
  }

  deleteAddress(userId: number, addressId:number) : Observable<BlogAppResponse<void>> {
    return this.httpClient.delete<BlogAppResponse<void>>(`${this.BASE_URL}/${userId}/addresses/${addressId}`);
  }

  forgotPassword(forgotPassword: ForgotPassword) : Observable<BlogAppResponse<string>> {
    return this.httpClient.post<BlogAppResponse<string>>(`${this.BASE_URL}/forgot-password`,forgotPassword);
  }

  changePassword(changePassword: ChangePassword) : Observable<BlogAppResponse<string>> {
    return this.httpClient.post<BlogAppResponse<string>>(`${this.BASE_URL}/change-password`,changePassword);
  }

  verifyEmail(verifyEmail: VerifyEmail) : Observable<BlogAppResponse<string>> {
    return this.httpClient.post<BlogAppResponse<string>>(`${this.BASE_URL}/verify-email`,verifyEmail);
  }

}
