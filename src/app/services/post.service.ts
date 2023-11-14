import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogappPageableResponse } from '../model/blogapp-pageable-response';
import { BlogappResponse } from '../model/blogapp-response';
import { Post } from '../model/post';
import { Comment } from '../model/comment';
import { Activity } from '../model/activity';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private BASE_URL = "http://localhost:8080/api/v1/posts";
  private BASE_URL_COMMENT = "http://localhost:8080/api/v1/comments";
  private BASE_URL_ACTIVITY = "http://localhost:8080/api/v1/activities";

  constructor(private httpClient : HttpClient) { }

  createPost(formData: FormData): Observable<BlogappResponse<Post>> {
    return this.httpClient.post<BlogappResponse<Post>>(`${this.BASE_URL}`, formData);
  }

  updatePost(formData: FormData, postId: number) : Observable<BlogappResponse<Post>> {
    return this.httpClient.put<BlogappResponse<Post>>(`${this.BASE_URL}/${postId}`, formData);
  }

  getPost(postId : number): Observable<BlogappResponse<Post>> {
    return this.httpClient.get<BlogappResponse<Post>>(`${this.BASE_URL}/${postId}`);
  }

  getAllPost(pageNumber:number = 0, pageSize:number = 10): Observable<BlogappResponse<BlogappPageableResponse<Post[]>>>{
    return this.httpClient.get<BlogappResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getAllApprovedPost(pageNumber:number = 0, pageSize:number = 10): Observable<BlogappResponse<BlogappPageableResponse<Post[]>>>{
    return this.httpClient.get<BlogappResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}/approved?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getAllPendingPost(pageNumber:number = 0, pageSize:number = 10): Observable<BlogappResponse<BlogappPageableResponse<Post[]>>>{
    return this.httpClient.get<BlogappResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}/pending?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getAllDeletedPost(pageNumber:number = 0, pageSize:number = 10): Observable<BlogappResponse<BlogappPageableResponse<Post[]>>>{
    return this.httpClient.get<BlogappResponse<BlogappPageableResponse<Post[]>>>(`${this.BASE_URL}/deleted?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  deletePost(postId:number): Observable<BlogappResponse<void>> {
    return this.httpClient.delete<BlogappResponse<void>>(`${this.BASE_URL}/${postId}`,);
  }

  addComment(comment: Comment) : Observable<BlogappResponse<Comment>> {
    return this.httpClient.post<BlogappResponse<Comment>>(`${this.BASE_URL_COMMENT}`,comment);

  }

  deleteComment(commentId:number): Observable<BlogappResponse<void>> {
    return this.httpClient.delete<BlogappResponse<void>>(`${this.BASE_URL_COMMENT}/${commentId}`);
  }

  updateComment(comment: Comment, commentId: number) : Observable<BlogappResponse<Comment>> {
    return this.httpClient.put<BlogappResponse<Comment>>(`${this.BASE_URL_COMMENT}/${commentId}`, comment);
  }

  createActivity(activity: Activity) : Observable<BlogappResponse<Activity>> {
    return this.httpClient.post<BlogappResponse<Activity>>(`${this.BASE_URL_ACTIVITY}`,activity);
  }

  updateActivity(activity: Activity, activityId: number) : Observable<BlogappResponse<Activity>> {
    return this.httpClient.put<BlogappResponse<Activity>>(`${this.BASE_URL_ACTIVITY}/${activityId}`,activity);
  }

  deleteActivity(activityId:number): Observable<BlogappResponse<void>> {
    return this.httpClient.delete<BlogappResponse<void>>(`${this.BASE_URL_ACTIVITY}/${activityId}`);
  }

}
