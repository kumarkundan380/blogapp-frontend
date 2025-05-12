import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlogappPageableResponse } from '../model/blogapp-pageable-response';
import { BlogAppResponse } from '../model/blogapp-response';
import { Post } from '../model/post';
import { Comment } from '../model/comment';
import { Activity } from '../model/activity';
import { PostSearchRequest } from '../model/post-search-request';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly BASE_URL = `${environment.apiBaseUrl}/posts`; 
  private readonly BASE_URL_COMMENT = `${environment.apiBaseUrl}/comments`; 
  private readonly BASE_URL_ACTIVITY = `${environment.apiBaseUrl}/activities`; 

  constructor(private httpClient : HttpClient) { }

  createPost(post: Post, file?: File | null): Observable<BlogAppResponse<Post>> {
    
    let formData = new FormData();
    // Append Post details as JSON Blob
    formData.append("postDTO", new Blob([JSON.stringify(post)], { type: "application/json" }));
    // Append image file (if exists)
    if (file) {
      formData.append("image", file);
    }
    return this.httpClient.post<BlogAppResponse<Post>>(`${this.BASE_URL}`, formData);
  }

  updatePost(post: Post, slug: string, file?: File | null) : Observable<BlogAppResponse<Post>> {
    
    let formData = new FormData();
     // Append Post details as JSON Blob
     formData.append("postDTO", new Blob([JSON.stringify(post)], { type: "application/json" }));
     // Append image file (if exists)
     if (file) {
       formData.append("image", file);
     }
    return this.httpClient.put<BlogAppResponse<Post>>(`${this.BASE_URL}/${slug}`, formData);
  }

  increaseViewCount(slug: string): Observable<BlogAppResponse<Post>> {
    return this.httpClient.put<BlogAppResponse<Post>>(`${this.BASE_URL}/${slug}/increment-view`,null);
  }

  getPost(slug : string): Observable<BlogAppResponse<Post>> {
    return this.httpClient.get<BlogAppResponse<Post>>(`${this.BASE_URL}/${slug}`);
  }

  getAllPost(postSearchRequest: PostSearchRequest,pageNumber:number = 0, pageSize:number = 10): Observable<BlogAppResponse<BlogappPageableResponse<Post[]>>>{
    
    return this.httpClient.post<BlogAppResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}/search-post?pageNumber=${pageNumber}&pageSize=${pageSize}`, postSearchRequest);
  }


  getAllPostsByUser(userId: number,pageNumber:number = 0, pageSize:number = 10): Observable<BlogAppResponse<BlogappPageableResponse<Post[]>>>{
    
    return this.httpClient.get<BlogAppResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getAllApprovedPost(pageNumber:number = 0, pageSize:number = 10): Observable<BlogAppResponse<BlogappPageableResponse<Post[]>>>{
    return this.httpClient.get<BlogAppResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}/approved?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getAllPendingPost(pageNumber:number = 0, pageSize:number = 10): Observable<BlogAppResponse<BlogappPageableResponse<Post[]>>>{
    return this.httpClient.get<BlogAppResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}/pending?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getAllDeletedPost(pageNumber:number = 0, pageSize:number = 10): Observable<BlogAppResponse<BlogappPageableResponse<Post[]>>>{
    return this.httpClient.get<BlogAppResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}/deleted?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  
  deletePost(slug:string): Observable<BlogAppResponse<void>> {
    return this.httpClient.delete<BlogAppResponse<void>>(`${this.BASE_URL}/${slug}`,);
  }

  addComment(comment: Comment) : Observable<BlogAppResponse<Comment>> {
    return this.httpClient.post<BlogAppResponse<Comment>>(`${this.BASE_URL_COMMENT}`,comment);

  }

  deleteComment(commentId:number): Observable<BlogAppResponse<void>> {
    return this.httpClient.delete<BlogAppResponse<void>>(`${this.BASE_URL_COMMENT}/${commentId}`);
  }

  updateComment(comment: Comment, commentId: number) : Observable<BlogAppResponse<Comment>> {
    return this.httpClient.put<BlogAppResponse<Comment>>(`${this.BASE_URL_COMMENT}/${commentId}`, comment);
  }

  createActivity(activity: Activity) : Observable<BlogAppResponse<Activity>> {
    return this.httpClient.post<BlogAppResponse<Activity>>(`${this.BASE_URL_ACTIVITY}`,activity);
  }

  updateActivity(activity: Activity, activityId: number) : Observable<BlogAppResponse<Activity>> {
    return this.httpClient.put<BlogAppResponse<Activity>>(`${this.BASE_URL_ACTIVITY}/${activityId}`,activity);
  }

  deleteActivity(activityId:number): Observable<BlogAppResponse<void>> {
    return this.httpClient.delete<BlogAppResponse<void>>(`${this.BASE_URL_ACTIVITY}/${activityId}`);
  }

}
