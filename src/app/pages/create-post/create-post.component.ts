import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { Post } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  createPostForm!: FormGroup;
  categories: Category[] = [];
  selectedFile: File | null = null;
  imageSrc: string | ArrayBuffer | null = null;
  userId!: number;
  isAdmin = false;
  isSuperAdmin = false;
  selectedFileName: string = '';
  config = { 
    height: 300,
    menubar: false,
    plugins: 'link image code lists',
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code'
  }
  isDirty = false;

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private postService: PostService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserInfo()?.userId!;
    this.initializeForm(); 
    this.initializeRoles(); 
    this.loadCategories();
  }

  private initializeRoles(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
      this.isAdmin = this.authService.isAdminUser(userInfo);
    }
  }

  private initializeForm(): void {
    this.createPostForm = this.formBuilder.group({
      postTitle: ['', Validators.required],
      postContent: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
    this.createPostForm.valueChanges.subscribe(() => {
      this.isDirty = true;
    });
  }

  private loadCategories(): void {
    this.categoryService.getAllCategory().subscribe({
      next: (response) => (this.categories = response.body),
      error: (error) => this.showError(error.error.errorMessage)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = e.target?.result ?? null); // ✅ Handles undefined
      reader.readAsDataURL(this.selectedFile);
      this.isDirty = true;
    } else {
      this.selectedFile = null;
      this.imageSrc = null;
    }
  }

  onSubmit(): void {
    if (this.createPostForm.invalid) return;

    const post: Post = {
      postTitle: this.createPostForm.value.postTitle,
      postContent: this.createPostForm.value.postContent,
      categoryId: this.createPostForm.value.categoryId,
      userId: this.userId,
      isEdited: false

    };
    this.createPost(post);
  }

  onReset(): void {
    this.createPostForm.reset();
    this.selectedFileName = '';
    this.imageSrc = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.isDirty = false;
  }

  private createPost(post: Post): void {
  
    this.postService.createPost(post, this.selectedFile).subscribe({
      next: (response) => {
        this.showSuccess(response.message);
        this.createPostForm.reset();
        this.navigateHome();
      },
      error: (error) => this.showError(error.error?.errorMessage)
    });
  }

  private navigateHome(): void {
    this.router.navigate([this.isAdmin ? '/admin' : '/']);
    const routePath = this.isSuperAdmin || this.isAdmin
      ? `/admin/posts`
      : `/posts`;
    this.router.navigate([routePath]);
  }

  private showSuccess(message: string): void {
    this._snackBar.open(message, 'OK', { duration: 3000, verticalPosition: 'top' });
  }

  private showError(message: string): void {
    this._snackBar.open(message, 'OK', { duration: 3000, verticalPosition: 'top' });
  }

}
