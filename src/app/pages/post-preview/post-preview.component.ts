import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostStatus } from 'src/app/model/post';
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

  isAdmin = false;
  isSuperAdmin = false;
  post: Post | null = null;
  comments: Comment[] = [];
  addCommentForm: FormGroup;
  editCommentForm: FormGroup;
  commentId: number | null = null;
  postId: number = 0;
  isLoggedIn = false;
  likeCount = 0;
  disLikeCount = 0;
  postLiked = false;
  postDisLiked = false;
  canEditOrDeleteComment = false;
  @ViewChild('commentBox') commentBoxRef?: ElementRef;
  ignoreNextClick = false;
  currentUser: User | null = null;
  editingCommentId: number | null = null;
  slug: string = '';

  constructor(
    private authService: AuthService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {
    this.addCommentForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });

    this.editCommentForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
  }
  

  ngOnInit(): void {
    this.slug = this.activateRoute.snapshot.params['slug'];
    this.getPost(this.slug);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.initializeRoles();
  }

  ngAfterViewInit(): void {
    // This lifecycle hook ensures that @ViewChild is correctly initialized.
  }

  private initializeRoles(): void {
    this.currentUser = this.authService.getUserInfo();
    if (this.currentUser) {
      this.isSuperAdmin = this.authService.isSuperAdminUser(this.currentUser);
      this.isAdmin = this.authService.isAdminUser(this.currentUser);
    }
  }

  getPost(slug: string): void {
    
    this.postService.getPost(slug).subscribe({
      next: ({ body }) => {
        this.post = body;
        this.comments = body.comments || [];
        this.processPostActivities(body.activities || []);
        this.processCommentActivities();
      },
      error: (error) => this.showMessage(error.error?.errorMessage)
    });
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.ignoreNextClick || !this.commentBoxRef) {
      return;
    }
    const clickedInside = this.commentBoxRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.commentId = null;
    }
  }

  processPostActivities(activities: Activity[]): void {
    
    this.likeCount = activities.filter(a => a.activityType === "LIKE").length;
    this.disLikeCount = activities.filter(a => a.activityType === "DISLIKE").length;

    const userActivity = activities.find(a => a.user.userId === this.currentUser?.userId);
    this.postLiked = userActivity?.activityType === "LIKE";
    this.postDisLiked = userActivity?.activityType === "DISLIKE";
  }

  processCommentActivities(): void {
    
    this.comments.forEach(comment => {
      const activities = comment.activities || [];
      const userActivity = activities.find(a => a.user.userId === this.currentUser?.userId);
      comment.isCommentLiked = userActivity?.activityType === "LIKE";
      comment.isCommentDisliked = userActivity?.activityType === "DISLIKE";
      comment.commentLikedCount = activities.filter(a => a.activityType === "LIKE").length;
      comment.commentDisLikedCount = activities.filter(a => a.activityType === "DISLIKE").length;
    });
  }

  togglePostReaction(type: 'LIKE' | 'DISLIKE'): void {
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if(PostStatus.PUBLISHED !== this.post?.status){
      return;
    }
    const activity = this.post?.activities?.find(a => a.user.userId === this.currentUser?.userId);
    const currentType = activity?.activityType;
    const activityId = activity?.activityId;

    if (currentType === type) {
      if (activityId) {
        this.deleteActivity(activityId);
      }
    } else if (currentType) {
      if (activityId) {
        this.updateActivity(this.buildActivity(type, 'POST', this.post?.postId), activityId);
      }
    } else {
      this.createActivity(this.buildActivity(type, 'POST', this.post?.postId));
    }
  }

  toggleCommentReaction(comment: Comment, type: 'LIKE' | 'DISLIKE'): void {
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    const activity = comment.activities?.find(a => a.user.userId === this.currentUser?.userId);
    const currentType = activity?.activityType;
    const activityId = activity?.activityId;

    if (currentType === type) {
      if (activityId) {
        this.deleteActivity(activityId);
      }
    } else if (currentType) {
      if (activityId) {
        this.updateActivity(this.buildActivity(type, 'COMMENT', undefined, comment.commentId), activityId);
      }
    } else {
      this.createActivity(this.buildActivity(type, 'COMMENT', undefined, comment.commentId));
    }
  }

  buildActivity(type: string, entityType: string, postId?: number, commentId?: number): Activity {
    
    if (!this.currentUser || !this.currentUser.userId) {
      throw new Error("Current user is not defined");
    }
    return {
      activityType: type,
      entityType,
      user: this.currentUser,
      userId: this.currentUser.userId,
      postId,
      commentId
    };
  }
  
  createActivity(activity: Activity): void {
    this.postService.createActivity(activity).subscribe({
      next: () => {
        this.getPost(this.slug);
      },
      error: (error) => this.showMessage(error.error?.errorMessage)
    });
  }
  

  updateActivity(activity: Activity, activityId: number): void {
    this.postService.updateActivity(activity, activityId).subscribe({
      next: () => {
        this.getPost(this.slug);
      },
      error: (error) => this.showMessage(error.error?.errorMessage)
    });
  }

  deleteActivity(activityId: number): void {
    
    this.postService.deleteActivity(activityId).subscribe({
      next: () => {
        if (this.slug) {
          this.getPost(this.slug);
        }
      },
      error: (error) => this.showMessage(error.error.errorMessage)
    });
  }

  onSubmit(): void {
    if (this.addCommentForm.invalid) {
      return;
    }

    if (!this.post) {
      this.showMessage("Something went wrong: Missing post information.");
      return;
    }

    if (!this.currentUser || !this.currentUser.userId) {
      this.showMessage("Something went wrong: Missing user information.");
      return;
    }
    
    const comment: Comment = {
      content: this.addCommentForm.value.content,
      post: this.post,
      user: this.currentUser,
      userId: this.currentUser.userId,
      postId: this.post.postId,
      isEdited: false
    };
    this.addComment(comment);
  }

  editComment(comment: Comment): void {
    this.editCommentForm.patchValue({ content: comment.content });
    this.commentId = comment.commentId ?? null;
    this.ignoreNextClick = true;
    setTimeout(() => (this.ignoreNextClick = false));
  }

  modifyComment(comment: Comment): void {

    if (!this.post) {
      this.showMessage("Something went wrong: Missing post information.");
      return;
    }

    if( !comment || ! comment.user || !comment.user.userId) {
      this.showMessage("Something went wrong: Missing comment information.");
      return;
    }

    const updatedComment: Comment = {
      content: this.editCommentForm.value.content,
      post: this.post,
      user: comment.user,
      userId: comment.user.userId,
      postId: this.post.postId,
      isEdited: true
    };

    if (this.commentId !== null) {
      this.postService.updateComment(updatedComment, this.commentId).subscribe({
        next: () => {
          this.commentId = null;
          this.getPost(this.slug);
        },
        error: (error) => this.showMessage(error.error?.errorMessage)
      });
    }
  }

  deleteComment(comment: Comment): void {
    this.dialogService.openConfirmDialog('Are you sure you want to delete this comment?').afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && comment.commentId) {
        this.postService.deleteComment(comment.commentId).subscribe({
          next: () => {
            if (this.slug) {
              this.getPost(this.slug);
            }
          },
          error: (error) => this.showMessage(error.error?.errorMessage)
        });
      }
    });
  }

  deletePost(post: Post): void {
    
    this.dialogService.openConfirmDialog('Are you sure you want to delete this post?')
      .afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed && post.slug) {
          this.postService.deletePost(post.slug).subscribe({
            next: (res) => {
              this.showMessage(res.message);
              this.goToHomePage();
            },
            error: (error) => this.showMessage(error.error?.errorMessage)
          });
        }
      });
  }

  goToHomePage(): void {
    this.router.navigate([(this.isSuperAdmin || this.isAdmin) ? '/admin' : '/posts']);
  }

  editPost(post: Post): void {
    this.router.navigate([`update-post/${post.slug}`]);
  }

  getFullName(user: User): string {
    return [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');
  }

  isPostOwner(userId: number): boolean {
    return this.currentUser?.userId === userId;
  }

  isPostPublished(): boolean {
    return PostStatus.PUBLISHED === this.post?.status;
  }

  private showMessage(message: string): void {
    this._snackBar.open(message, 'OK', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  addComment(comment: Comment): void {
    this.postService.addComment(comment).subscribe({
      next: () => {
        this.getPost(this.slug);
      },
      error: (error) => this.showMessage(error.error.errorMessage)
    });
    this.addCommentForm.reset();
  }

  getCommentLikedCount(comment: Comment){
    return (comment.activities || []).filter(activity => activity.activityType==="LIKE").length;
  }

  getCommentDisLikedCount(comment: Comment) {
    return (comment.activities || []).filter(activity => activity.activityType==="DISLIKE").length;
  }

}
