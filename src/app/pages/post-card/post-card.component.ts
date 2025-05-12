import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Post, PostStatus } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {

  isAdmin = false;
  isSuperAdmin = false;
  @Input() post!: Post;

  constructor(private authService: AuthService,
    private dialogService: DialogService,
    private router: Router,
    private postService: PostService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.initializeRoles();
  //  this.initializeForm();
  //  this.getAllPosts(this.buildSearchRequest());
  //  this.loadCategories();
  //  this.setupSearchListForAdminOrSuperAdmin();
  }

  private initializeRoles(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
      this.isAdmin = this.authService.isAdminUser(userInfo);
    }
  }

  deletePost(post: Post): void {
    this.dialogService.openConfirmDialog('Are you sure you want to delete this post?')
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed && post.slug) {
          this.postService.deletePost(post.slug).subscribe({
            next: ({ message }) => {
              post.status = PostStatus.DELETED; 
              this.showMessage(message);
            },
            error: ({ error }) => {
              this.showMessage(error?.errorMessage || 'Failed to delete post')
            }  
          });
        }
      });
  }


  readMore(post: Post){
    this.increaseViewCount(post);
    this.router.navigate([`/posts/${post.slug}`]);
  }

  private increaseViewCount(post: Post): void {
    if(post && (PostStatus.PUBLISHED === post.status) && post.slug) {
      this.postService.increaseViewCount(post.slug).subscribe({
        next: () => {},
        error: (error) => this.showMessage(error?.errorMessage)
      });
    } 
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  updatePost(post: Post) {
    this.router.navigate([`/update-post/${post.slug}`]);
  }


}
