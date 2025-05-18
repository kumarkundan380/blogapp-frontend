import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactMessage } from '../model/contact-message';
import { BlogAppResponse } from '../model/blogapp-response';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  private readonly BASE_URL = `${environment.apiBaseUrl}/contact-us`; 

  constructor(private http: HttpClient) { }


  submitContactForm(message: ContactMessage): Observable<BlogAppResponse<ContactMessage>> {
    return this.http.post<BlogAppResponse<ContactMessage>>(this.BASE_URL, message);
  }

  getAllMessages(): Observable<BlogAppResponse<ContactMessage[]>> {
    return this.http.get<BlogAppResponse<ContactMessage[]>>(`${this.BASE_URL}`);
  }


  deleteMessage(contactMessageId:number): Observable<BlogAppResponse<ContactMessage>> {
    return this.http.delete<BlogAppResponse<ContactMessage>>(`${this.BASE_URL}/${contactMessageId}`);
  }

}


