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

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.css']
})
export class PostPreviewComponent implements OnInit{

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
      },
      error:(error) => {
        this._snackBar.open(error.error?.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
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
