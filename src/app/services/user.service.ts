import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Address } from '../model/address';
import { BlogappPageableResponse } from '../model/blogapp-pageable-response';
import { BlogappResponse } from '../model/blogapp-response';
import { ChangePassword } from '../model/change-password';
import { ForgotPassword } from '../model/forgot-password';
import { Role } from '../model/role';
import { User } from '../model/user';
import { VerifyEmail } from '../model/verify-email';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = "http://localhost:8080/api/v1/users";
  userSubject = new Subject<User>();
  userRoles = new Subject<string[]>();

  constructor(private httpClient : HttpClient) { }

  registerUser(formData: FormData): Observable<BlogappResponse<User>> {
    return this.httpClient.post<BlogappResponse<User>>(`${this.BASE_URL}`, formData);
  }

  getUser(userId : number): Observable<BlogappResponse<User>> {
    return this.httpClient.get<BlogappResponse<User>>(`${this.BASE_URL}/${userId}`);
  }

  getAllUser(pageNumber:number = 0, pageSize:number = 10): Observable<BlogappResponse<BlogappPageableResponse<User[]>>>{
    return this.httpClient.get<BlogappResponse<BlogappPageableResponse<User[]>>>(`${this.BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  updateUser(formData: FormData, userId: number) : Observable<BlogappResponse<User>> {
    return this.httpClient.put<BlogappResponse<User>>(`${this.BASE_URL}/${userId}`, formData);
  }

  getAllRoles(): Observable<BlogappResponse<Role[]>> {
    return this.httpClient.get<BlogappResponse<Role[]>>(`${this.BASE_URL}/roles`);
  }


  updateRoles(userId:number,rolesList:Role[]): Observable<BlogappResponse<User>> {
    return this.httpClient.put<BlogappResponse<User>>(`${this.BASE_URL}/${userId}/roles`,rolesList);
  }

  deleteUser(userId:number): Observable<BlogappResponse<void>> {
    return this.httpClient.delete<BlogappResponse<void>>(`${this.BASE_URL}/${userId}`,);
  }

  addAddress(address: Address, userId: number) : Observable<BlogappResponse<User>> {
    return this.httpClient.post<BlogappResponse<User>>(`${this.BASE_URL}/${userId}/address`, address);
  }

  getAllAddressess(userId: number) : Observable<BlogappResponse<Address[]>> {
    return this.httpClient.get<BlogappResponse<Address[]>>(`${this.BASE_URL}/${userId}/address`);
  }

  updateAddress(userId: number, addressId:number, address: Address) : Observable<BlogappResponse<User>> {
    return this.httpClient.put<BlogappResponse<User>>(`${this.BASE_URL}/${userId}/address/${addressId}`, address);
  }

  getOneAddress(userId: number, addressId:number) : Observable<BlogappResponse<Address>> {
    return this.httpClient.get<BlogappResponse<Address>>(`${this.BASE_URL}/${userId}/address/${addressId}`);
  }

  deleteAddress(userId: number, addressId:number) : Observable<BlogappResponse<void>> {
    return this.httpClient.delete<BlogappResponse<void>>(`${this.BASE_URL}/${userId}/address/${addressId}`);
  }

  forgotPassword(forgotPassword: ForgotPassword) : Observable<BlogappResponse<string>> {
    return this.httpClient.post<BlogappResponse<string>>(`${this.BASE_URL}/forgot-password`,forgotPassword);
  }

  changePassword(changePassword: ChangePassword) : Observable<BlogappResponse<string>> {
    return this.httpClient.post<BlogappResponse<string>>(`${this.BASE_URL}/change-password`,changePassword);
  }

  verifyEmail(verifyEmail: VerifyEmail) : Observable<BlogappResponse<string>> {
    return this.httpClient.post<BlogappResponse<string>>(`${this.BASE_URL}/verify-email`,verifyEmail);
  }


}
