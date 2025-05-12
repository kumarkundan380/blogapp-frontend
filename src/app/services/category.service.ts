import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlogAppResponse } from '../model/blogapp-response';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly BASE_URL = `${environment.apiBaseUrl}/categories`; 

  constructor(private httpClient : HttpClient) { }

  addCategory(category: Category): Observable<BlogAppResponse<Category>> {
    return this.httpClient.post<BlogAppResponse<Category>>(`${this.BASE_URL}`, category);
  }

  updateCategory(category: Category,categoryId:number): Observable<BlogAppResponse<Category>> {
    return this.httpClient.put<BlogAppResponse<Category>>(`${this.BASE_URL}/${categoryId}`, category);
  }

  getCategory(categoryId : number): Observable<BlogAppResponse<Category>> {
    return this.httpClient.get<BlogAppResponse<Category>>(`${this.BASE_URL}/${categoryId}`);
  }

  getAllCategory(): Observable<BlogAppResponse<Category[]>>{
    return this.httpClient.get<BlogAppResponse<Category[]>>(`${this.BASE_URL}`);
  }

  deleteCategory(categoryId : number): Observable<BlogAppResponse<Category>> {
    return this.httpClient.delete<BlogAppResponse<Category>>(`${this.BASE_URL}/${categoryId}`);
  }

}
