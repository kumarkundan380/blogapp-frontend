import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogappPageableResponse } from 'src/app/model/blogapp-pageable-response';
import { Post } from 'src/app/model/post';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId!: number;
  user!: User;
  userImage: string = '../../../assets/profile.png';
  isSuperAdmin = false;
  isAdmin = false;
  posts!: BlogappPageableResponse<Post[]>;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['userId'];
    this.loadUser();
    this.getAllPostByUser(this.userId);
  }

  private loadUser(): void {
    this.userService.getUser(this.userId).subscribe({
      next: (response) => {
        this.user = response.body;
        if (this.user?.userImage) {
          this.userImage = this.user.userImage;
        }
        if(this.user) {
          this.isSuperAdmin = this.authService.isSuperAdminUser(this.user);
          this.isAdmin = this.authService.isAdminUser(this.user);
        }
      },
      error: (error) => this.showMessage(error.error.errorMessage)
    });
  }

  private getAllPostByUser(userId: number, pageNumber: number = 0): void {
    this.postService.getAllPostsByUser(userId, pageNumber).subscribe({
      next: ({ body }) => this.posts = body,
      error: ({ error }) => this.showMessage(error.error?.errorMessage || 'Failed to fetch posts')
    });
  }

  updateUser(): void {
    const routePath = this.isSuperAdmin || this.isAdmin
      ? `/admin/update-user/${this.userId}`
      : `/update-user/${this.userId}`;
    this.router.navigate([routePath]);
  }

  getFullName(user: User): string {
    return [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(' ');
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.posts?.totalPages || 0 }, (_, i) => i);
  }


  onPageChange(pageNumber: number): void {
    this.getAllPostByUser(this.userId, pageNumber);
  }

}
