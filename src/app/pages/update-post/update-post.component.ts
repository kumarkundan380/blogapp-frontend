import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { Post, PostStatus } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFileName: string = '';
  updatePostForm!: FormGroup;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  statusChanged: boolean = false;
  post!: Post;
  postId!: number;
  userId!: number;
  selectedFile: File | null = null;
  imageSrc: string | ArrayBuffer | null = null;
  categories!: Category[];
  statusList = Object.values(PostStatus);
  config = { 
    height: 300,
    menubar: false,
    plugins: 'link image code lists',
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code'
  }
  slug: string = '';
  formChanged = false;

  constructor(
    private authService: AuthService,
    private activateRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private postService: PostService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.userId != null) {
      this.userId = userInfo.userId;
      this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
      this.isAdmin = this.authService.isAdminUser(userInfo);
    } else {
      this.showMessage("User is not valid");
      return;
    }
    this.slug = this.activateRoute.snapshot.params['slug'];
    this.initializeForm();
    this.getAllCategories();
    this.getPost(this.slug);
  }

  initializeForm(): void {
    this.updatePostForm = this.formBuilder.group({
      postTitle: ['', Validators.required],
      postContent: ['', Validators.required],
      categoryId: ['', Validators.required],
      ...((this.isSuperAdmin || this.isAdmin) && { status: ['', Validators.required] }) // Add status field if super admin or admin
    });
  }

  getPost(slug: string): void {

    this.postService.getPost(slug).subscribe({
      next: (data) => {
        this.post = data.body;
        this.populateForm(data.body);
      },
      error: (error) => this.showMessage(error.error?.errorMessage)
    });
  }

  // Populate form fields with user data
  private populateForm(post: Post): void {
    
    if (!post) return;

    this.updatePostForm.patchValue({
      postTitle: this.post.postTitle,
      postContent: this.post.postContent,
      categoryId: this.post.category?.categoryId,
      ...((this.isSuperAdmin || this.isAdmin) && { status: this.post?.status})
    });

    this.updatePostForm.valueChanges.subscribe(() => {
      this.formChanged = !this.isFormUnchanged();
    });

      // Set Profile Image
    if (post.imageUrl) {
      this.imageSrc = post.imageUrl;
      this.selectedFileName = '';
    }
  }

  private isFormUnchanged(): boolean {
    
    const formValue = this.updatePostForm.value;
  
    const trim = (val: any) => typeof val === 'string' ? val.trim() : val;
  
    const updatedPost: Partial<Post> = {
      postTitle: trim(formValue.postTitle),
      postContent: trim(formValue.postContent),
      categoryId: trim(formValue.categoryId),
      ...((this.isSuperAdmin || this.isAdmin) && {
        status: trim(formValue.status)
      })
    };
    
    const originalPost = {
      postTitle: this.post.postTitle,
      postContent: this.post.postContent,
      categoryId: this.post.category?.categoryId,
      ...((this.isSuperAdmin || this.isAdmin) && {
        status: this.post.status
      })
    };
    // Compare JSON stringified versions
    return JSON.stringify(updatedPost) === JSON.stringify(originalPost);
  }

  getAllCategories(): void {

    this.categoryService.getAllCategory().subscribe({
      next: (data) => (this.categories = data.body),
      error: (error) => this.showMessage(error.error?.errorMessage)
    });
  }

  onSubmit(): void {

    if (this.updatePostForm.invalid) return;
  
     const formValue = this.updatePostForm.value;
     // If no changes made and no new file uploaded, don't submit
     if (this.isFormUnchanged() && !this.selectedFile) {
      this.showMessage("No meaningful changes detected.");
      return;
    }
    this.statusChanged = (this.isSuperAdmin || this.isAdmin) && formValue.status !== this.post.status;
    const updatedPost: Post = {
      ...this.updatePostForm.value,
      userId: this.userId,
      isEdited: !this.statusChanged
    };
    // this.updatePost(updatedPost, this.postId);
    this.updatePost(updatedPost, this.slug);
  }

  onReset(): void {
    this.populateForm(this.post);
  }

  // Handle file selection
  onFileSelected(event: any): void {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = (e) => this.imageSrc = e.target?.result ?? null;
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.imageSrc = null;
    }
    // File selection counts as a change
    this.formChanged = true;
  }

  updatePost(post: Post, slug: string): void {
    
    this.postService.updatePost(post, slug, this.selectedFile).subscribe({
      next: (data) => {
        this.showMessage(data.message);
        this.updatePostForm.reset();
        this.goToHomePage();
      },
      error: (error) => this.showMessage(error.error?.errorMessage)
    });
  }

  goToHomePage(): void {

    this.router.navigate([`/posts/${this.slug}`]);
  }

  private showMessage(message: string): void {
    this._snackBar.open(message, 'OK', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
