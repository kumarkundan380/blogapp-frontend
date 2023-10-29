import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Post } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  posts!: Post[];

  constructor(private postService : PostService,
    private authService: AuthService, 
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService){
  }
 

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(){
    this.postService.getAllApprovedPost().subscribe({
      next: (data) => {
        this.posts = data.body.content
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  createPost(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigate([`/create-post`]);
    } else {
      this.authService.showLoginButtonSubject.next(false);
      this.router.navigate([`/login`]);
    }
    
  }

  updatePost(post: Post) {
    this.router.navigate([`/update-post/${post.postId}`]);
  }

  deletePost(post: Post) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe((res:boolean) =>{
      if(res){
        this.postService.deletePost(post.postId!).subscribe({
          next: (data) => {
            this._snackBar.open(data.message, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
            this.getAllPosts();
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

  readMore(post:Post){
    this.router.navigate([`/posts/${post.postId}`]);
  }

  

}
