import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Address } from '../model/address';
import { BlogappPageableResponse } from '../model/blogapp-pageable-response';
import { BlogappResponse } from '../model/blogapp-response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = "http://localhost:8080/api/v1/users";
  userSubject = new Subject<User>();
  userRoles = new Subject<string[]>();

  constructor(private httpClient : HttpClient) { }

  // registerUser(user : User): Observable<BlogappResponse<User>> {
  //   return this.httpClient.post<BlogappResponse<User>>(`${this.BASE_URL}`, user);
  // }
  registerUser(formData: FormData): Observable<BlogappResponse<User>> {
    return this.httpClient.post<BlogappResponse<User>>(`${this.BASE_URL}`, formData);
  }

  getUser(userId : number): Observable<BlogappResponse<User>> {
    return this.httpClient.get<BlogappResponse<User>>(`${this.BASE_URL}/${userId}`);
  }

  getAllUser(pageNumber:number = 0, pageSize:number = 10): Observable<BlogappResponse<BlogappPageableResponse<User[]>>>{
    return this.httpClient.get<BlogappResponse<BlogappPageableResponse<User[]>>>(`${this.BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  // updateUser(user: User, userId: number) : Observable<BlogappResponse<User>> {
  //   return this.httpClient.put<BlogappResponse<User>>(`${this.BASE_URL}/${userId}`, user);
  // }
  updateUser(formData: FormData, userId: number) : Observable<BlogappResponse<User>> {
    return this.httpClient.put<BlogappResponse<User>>(`${this.BASE_URL}/${userId}`, formData);
  }

  updateRoles(userId:number,rolesList:string[]): Observable<BlogappResponse<User>> {
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

}
