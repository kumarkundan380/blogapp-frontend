import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/model/post';
import { User } from 'src/app/model/user';
import { Comment } from 'src/app/model/comment';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { Activity } from 'src/app/model/activity';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.css']
})
export class PostPreviewComponent implements OnInit {

  isAdmin!: boolean;
  post!: Post;
  user!: User;
  postId!: number;
  userId!: number;
  name!: string;
  comments!: Comment[];
  addCommentForm!: FormGroup;
  editCommentForm!: FormGroup;
  formBuilder: any;
  comment!: Comment;
  isEdit = false;
  updateComment!: Comment;
  commentId!: number;
  isLoggedIn!: boolean;
  activity!: Activity;
  likeCount: number = 0;
  disLikeCount: number = 0;
  likedUserId!: number[];
  disLikedUserId!: number[];
  activityId!: number;
  postLiked!: boolean;
  postDisLiked!: boolean;

  constructor(private authService : AuthService, 
    private activateRoute: ActivatedRoute,
    private router : Router,
    private postService: PostService,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService){
    
  }

  ngOnInit(): void {
    this.postId = this.activateRoute.snapshot.params['postId'];
    this.getPost(this.postId); 
    this.addCommentForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
    this.editCommentForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
    this.isAdmin = this.authService.isAdminUser(this.authService.getUserInfo());
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  getPost(postId:number){
    this.postService.getPost(postId).subscribe({
      next: (data) => {
        this.post = data.body;
        this.getLikeAndDisLikeCount(data.body); 
      },
      error:(error) => {
        this._snackBar.open(error.error?.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  getLikeAndDisLikeCount(post:Post){
    if(post.activities!?.length>0){
      this.likeCount = post.activities!.filter(activity => activity.activityType==="LIKE").length;
      this.likedUserId = post.activities!.filter(activity => activity.entityType==="Like").map(activity => activity.user.userId!);
      this.disLikeCount = post.activities!.filter(activity => activity.activityType==="DISLIKE").length;
      this.disLikedUserId = post.activities!.filter(activity => activity.entityType==="DISLIKE").map(activity => activity.user.userId!);
    } else {
      this.likeCount = 0;
      this.disLikeCount = 0;
    }
    this.postLiked = this.isPostLiked();
    this.postDisLiked = this.isPostDisLiked();
  }

  isPostLiked(){
    return (this.post.activities!.find(activity => activity.user.userId! === this.authService.getUserInfo()?.userId)?.activityType == "LIKE");
  }

  isPostDisLiked(){
    return (this.post.activities!.find(activity => activity.user.userId! === this.authService.getUserInfo()?.userId)?.activityType == "DISLIKE");
  }

  likePost(activityType:string, entityType: string, postId:number){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login']);
    } else {
      if(this.isPostLiked()){
        this.postDisLiked = false;
        this.activityId = this.post.activities!.find(activity => activity.user.userId! === this.authService.getUserInfo().userId)?.activityId!;
        this.deleteActivity(this.activityId);
      } else if(this.isPostDisLiked()){
        this.postLiked = false;
        this.activityId = this.post.activities!.find(activity => activity.user.userId! === this.authService.getUserInfo().userId)?.activityId!;
        this.activity = {
          activityType: activityType,
          entityType: entityType,
          user: this.authService.getUserInfo(),
          userId: this.authService.getUserInfo().userId!,
          postId: postId,
        }
        this.updateActivity(this.activity,this.activityId);
      } else{
        this.activity = {
          activityType: activityType,
          entityType: entityType,
          user: this.authService.getUserInfo(),
          userId: this.authService.getUserInfo().userId!,
          postId: postId,
        }
        this.createActivity(this.activity);
      }
    }
    
  }

  disLikePost(activityType:string,entityType: string, postId:number){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login']);
    } else {
      if(this.isPostDisLiked()){
        this.activityId = this.post.activities!.find(activity => activity.user.userId! === this.authService.getUserInfo().userId)?.activityId!;
        this.deleteActivity(this.activityId);
      } else if(this.isPostLiked()){
        this.activityId = this.post.activities!.find(activity => activity.user.userId! === this.authService.getUserInfo().userId)?.activityId!;
        this.activity = {
          activityType: activityType,
          entityType: entityType,
          user: this.authService.getUserInfo(),
          userId: this.authService.getUserInfo().userId!,
          postId: postId,
        }
        this.updateActivity(this.activity,this.activityId);
      } else {
        this.activity = {
          activityType: activityType,
          entityType: entityType,
          user: this.authService.getUserInfo(),
          userId: this.authService.getUserInfo().userId!,
          postId: postId,
        }
        this.createActivity(this.activity);
      }
    }
    
    
  }

  isPostAlreadyLiked(){
    return this.likedUserId?.includes(this.authService.getUserInfo().userId!);
  }

  isPostAlreadyDisLiked(){
    return this.disLikedUserId?.includes(this.authService.getUserInfo().userId!);
  }

  createActivity(activity: Activity) {
    this.postService.createActivity(activity).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.getPost(activity.postId!);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });

  }

  updateActivity(activity: Activity, activityId: number) {
    this.postService.updateActivity(activity, activityId).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.getPost(activity.postId!);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });

  }

  deleteActivity(activityId: number) {
    this.postService.deleteActivity(activityId).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.getPost(this.postId!);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });

  }

  goToHomePage() {
    if(this.isAdmin) {
      this.router.navigate([`/admin`])
    } else {
      this.router.navigate(['/']);
    }
  }

  editPost(post:Post){
    this.router.navigate([`update-post/${post.postId}`]);
  }

  deletePost(post:Post) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe((res:boolean) =>{
      if(res){
        this.postService.deletePost(post.postId!).subscribe({
          next: (data) => {
            this._snackBar.open(data.message, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
            this.getPost(this.postId);
            this.goToHomePage();
          },
          error: (error) => {
            this._snackBar.open(error.error.errorMessage, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
          }
        });
      }
    });
  }

  getFullName(post: Post){
    this.user = post?.user!;
    let fullName = this.user?.firstName;
    if(this.user?.middleName) {
      fullName+=" "+this.user?.middleName;
    }
    if(this.user?.lastName){
      fullName+=" "+this.user?.lastName;
    }
    return fullName;
  }

  getFullNameUser(user:User){
    let fullName = this.user?.firstName;
    if(this.user?.middleName) {
      fullName+=" "+this.user?.middleName;
    }
    if(this.user?.lastName){
      fullName+=" "+this.user?.lastName;
    }
    return fullName;
  }

  onSubmit(){
    this.comment = {
      content: this.addCommentForm.get('content')?.value,
      post: this.post,
      user: this.authService.getUserInfo(),
      userId: this.authService.getUserInfo().userId!,
      postId: this.postId,
    }
    this.addComment(this.comment);

  }

  addComment(comment: Comment) {
    this.postService.addComment(comment).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.addCommentForm.reset();
        this.getPost(this.postId);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
    
  }

  isSameUser(userId:number): boolean {
    return (this.authService.getUserInfo()?.userId === userId);
  }

  editComment(comment:Comment){
    this.isEdit = true;
    this.editCommentForm.patchValue({
      content:comment.content
    });
    this.commentId = comment.commentId!;

  }

  deleteComment(comment:Comment) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe((res:boolean) =>{
      if(res){
        this.postService.deleteComment(comment.commentId!).subscribe({
          next: (data) => {
            this._snackBar.open(data.message, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
            this.getPost(this.postId);
          },
          error: (error) => {
            this._snackBar.open(error.error.errorMessage, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
          }
        });
      }
    });
  }

  modifyComment(comment:Comment) {
    this.updateComment = {
      content: this.editCommentForm.get('content')?.value,
      post: this.post,
      user: comment.user,
      userId: comment.user.userId!,
      postId: this.post.postId!,
    }
    this.postService.updateComment(this.updateComment,comment.commentId!).subscribe({
      next: (data) => {
        this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.isEdit = false;
        this.editCommentForm.reset();
        this.getPost(this.postId);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
  }



}
