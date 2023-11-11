import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BlogappPageableResponse } from 'src/app/model/blogapp-pageable-response';
import { Post } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit{


  posts!: BlogappPageableResponse<Post[]>;
  isAdmin!: boolean;

  constructor(private postService : PostService, 
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService){
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdminUser(this.authService.getUserInfo());
    if(this.isAdmin) {
      this.getAllPosts();
    } else {
      this.getAllApprovedPost();
    }
  }

  getAllPosts(){
    this.postService.getAllPost().subscribe({
      next: (data) => {
        this.posts = data.body
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
  } 
    
  
  getAllApprovedPost(){
    this.postService.getAllApprovedPost().subscribe({
      next: (data) => {
        this.posts = data.body
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
  }

  createPost(): void {
    this.router.navigate([`/create-post`]);
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

  readMore(post: Post){
    this.router.navigate([`/posts/${post.postId}`]);
  }

  onPageChange(pageNumber: number): void {
    if(this.isAdmin) {
      this.postService.getAllPost(pageNumber).subscribe({
        next: (data) =>{
          this.posts = data.body
        },
        error: (error) => {
          this._snackBar.open(error.error.errorMessage, "OK", {
            duration: 3000,
            verticalPosition: 'top'
          })
        }
      });
    } else {
      this.postService.getAllApprovedPost(pageNumber).subscribe({
        next: (data) =>{
          this.posts = data.body
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



}
