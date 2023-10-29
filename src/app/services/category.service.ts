import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogappResponse } from '../model/blogapp-response';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private BASE_URL = "http://localhost:8080/api/v1/categories";

  constructor(private httpClient : HttpClient) { }

  addCategory(category: Category): Observable<BlogappResponse<Category>> {
    return this.httpClient.post<BlogappResponse<Category>>(`${this.BASE_URL}`, category);
  }

  updateCategory(category: Category,categoryId:number): Observable<BlogappResponse<Category>> {
    return this.httpClient.put<BlogappResponse<Category>>(`${this.BASE_URL}/${categoryId}`, category);
  }

  getCategory(categoryId : number): Observable<BlogappResponse<Category>> {
    return this.httpClient.get<BlogappResponse<Category>>(`${this.BASE_URL}/${categoryId}`);
  }

  getAllCategory(): Observable<BlogappResponse<Category[]>>{
    return this.httpClient.get<BlogappResponse<Category[]>>(`${this.BASE_URL}`);
  }

  deleteCategory(categoryId : number): Observable<BlogappResponse<Category>> {
    return this.httpClient.delete<BlogappResponse<Category>>(`${this.BASE_URL}/${categoryId}`);
  }

}
