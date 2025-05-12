import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BlogappPageableResponse } from 'src/app/model/blogapp-pageable-response';
import { Category } from 'src/app/model/category';
import { Post, PostStatus } from 'src/app/model/post';
import { PostSearchRequest } from 'src/app/model/post-search-request';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {


  posts: BlogappPageableResponse<Post[]>;
  isAdmin = false;
  isSuperAdmin = false;
  searchPostForm: FormGroup;
  postSearchRequest!: PostSearchRequest;
  categories: Category[] = [];
  postStatuses = Object.values(PostStatus);
  searchList = [
    { label: 'Post Title', value: 'postTitle', type: 'text' },
    { label: 'Category', value: 'category', type: 'dropdown' },
  ];
  selectedSearchType: 'text' | 'dropdown' = 'text';
  searchOptions: string[] = []; // For dropdown options
  userId: number | null | undefined;

  constructor(private postService : PostService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService){

      this.posts = {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElement: 0,
        totalPages: 0,
        isFirst: true,
        isLast: true
      };
    
      this.searchPostForm = this.formBuilder.group({
        searchKey: [''],
        searchValue: ['']
      });
  
  }

  ngOnInit(): void {
    this.initializeRoles();
    this.initializeForm();
    this.getAllPosts(this.buildSearchRequest());
    this.loadCategories();
    this.setupSearchListForAdminOrSuperAdmin();
  }

  private setupSearchListForAdminOrSuperAdmin(): void {
  
    if (this.isSuperAdmin || this.isAdmin) {
      this.searchList.push({ label: 'Status', value: 'status', type: 'dropdown' });
    }
  }

  private initializeRoles(): void {
    if(this.authService.isLoggedIn()) {
      const userInfo = this.authService.getUserInfo();
      if (userInfo) {
        this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
        this.isAdmin = this.authService.isAdminUser(userInfo);
        this.userId = userInfo.userId!;
      } else {
        this.userId = null;
      }
    } else {
      this.userId = null;
    }
    
  }

  private loadCategories(): void {
    this.categoryService.getAllCategory().subscribe({
      next: (response) => (this.categories = response.body),
      error: (error) => this.showMessage(error.error?.errorMessage)
    });
  }

  getAllPosts(postSearchRequest: PostSearchRequest, pageNumber: number = 0): void {
    this.postService.getAllPost(postSearchRequest, pageNumber).subscribe({
      next: ({ body }) => this.posts = body,
      error: ({ error }) => this.showMessage(error.error?.errorMessage || 'Failed to fetch posts')
    });
  }
   
  createPost(): void {
    this.router.navigate([this.authService.isLoggedIn() ? '/create-post' : '/login']);
  }

  onSubmit(): void {
    const searchKey = this.searchPostForm.get('searchKey')?.value;
    const searchValue = this.searchPostForm.get('searchValue')?.value;
    if (!searchKey || !searchValue?.trim()) {
      return; // Don't proceed if either field is empty
    }
    this.getAllPosts(this.buildSearchRequest());
  }

  onReset(): void {

    this.searchPostForm.reset();
    this.getAllPosts(this.buildSearchRequest());
  }

  onPageChange(pageNumber: number): void {
    this.getAllPosts(this.buildSearchRequest(), pageNumber);
  }

  private buildSearchRequest(): PostSearchRequest {
    const key = this.searchPostForm.get('searchKey')?.value;
    const value = this.searchPostForm.get('searchValue')?.value;

    const request: PostSearchRequest = {
      userId: this.userId // Replace with actual variable holding userId
    };
  
    if (!key || !value) return request;
  
    switch (key) {
      case 'postTitle':
        return { ...request, postTitle: value };
      case 'category':
        return { ...request, category: value };
      case 'status':
        return { ...request, postStatus: value as PostStatus };
      default:
        return request;
    }
  }
  
  private initializeForm(): void {
  
    this.searchPostForm.get('searchKey')?.valueChanges.subscribe(selectedKey => {
      const selected = this.searchList.find(opt => opt.value === selectedKey);
      this.selectedSearchType = (selected?.type as 'text' | 'dropdown') || 'text';
  
      // Set dropdown options
      if (selectedKey === 'category') {
        this.searchOptions = this.categories.map(cat => cat.categoryTitle);
      } else if (selectedKey === 'status') {
        this.searchOptions = this.postStatuses;
      } else {
        this.searchOptions = [];
      }
  
      // Clear search value on type change
      this.searchPostForm.get('searchValue')?.reset();
    });
  
  }

  trackByUserId(index: number, post: Post): number {
    return post.postId!;
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.posts?.totalPages || 0 }, (_, i) => i);
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
