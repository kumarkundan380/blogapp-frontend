import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminInfo } from '../model/adminInfo';
import { BlogappResponse } from '../model/blogapp-response';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private BASE_URL = "http://localhost:8080/api/v1/admin";

  constructor(private httpClient: HttpClient) { }

  getAdminInfo(): Observable<BlogappResponse<AdminInfo>> {
    return this.httpClient.get<BlogappResponse<AdminInfo>>(`${this.BASE_URL}`);
  }
}
