import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminInfo } from '../model/adminInfo';
import { BlogAppResponse } from '../model/blogapp-response';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly BASE_URL = `${environment.apiBaseUrl}/admin`; 

  constructor(private httpClient: HttpClient) { }

   /**
   * Fetches admin dashboard information.
   * @returns An Observable of BlogAppResponse containing AdminInfo
   */
  getAdminInfo(): Observable<BlogAppResponse<AdminInfo>> {
    return this.httpClient.get<BlogAppResponse<AdminInfo>>(this.BASE_URL);
  }

}
