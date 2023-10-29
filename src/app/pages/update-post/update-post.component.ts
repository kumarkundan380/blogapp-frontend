import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Category } from 'src/app/model/category';
import { Post } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent {

  updatePostForm!: FormGroup;
  isAdmin!: boolean;
  post!: Post;
  postId!: number;
  userId!: number;
  file!: Blob;
  selectedFile: File | null = null;
  imageSrc: string | ArrayBuffer | null | undefined = null;
  categories!: Category[];
  statusList!: string[]
  public Editor = ClassicEditor;

  constructor(private authService : AuthService, 
    private activateRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private postService: PostService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
    this.statusList = new Array("APPROVED","PENDING","DELETED");
    this.isAdmin = this.authService.isAdminUser(this.authService.getUserInfo());
    this.userId = this.authService.getUserInfo().userId!;
    this.postId = this.activateRoute.snapshot.params['postId'];
    this.getAllCategories();
    this.getPost(this.postId);
    if(this.isAdmin){
      this.updatePostForm = this.formBuilder.group({
        postTitle: new FormControl('',Validators.required),
        postContent: new FormControl('',Validators.required),
        categoryId: new FormControl('', Validators.required),
        status: new FormControl('',Validators.required)
      });
    } else {
      this.updatePostForm = this.formBuilder.group({
        postTitle: new FormControl('',Validators.required),
        postContent: new FormControl('',Validators.required),
        categoryId: new FormControl('', Validators.required),
      });
    }
    
  }

  getPost(postId:number){
    this.postService.getPost(postId).subscribe({
      next: (data) => {
        this.post = data.body;
        if(this.isAdmin){
          this.updatePostForm.patchValue({
            postTitle:this.post.postTitle,
            postContent:this.post.postContent,
            categoryId:this.post.category?.categoryId,
            status:this.post?.status!
          });
        } else{
          this.updatePostForm.patchValue({
            postTitle:this.post.postTitle,
            postContent:this.post.postContent,
            categoryId:this.post.category?.categoryId,
          });
        }
        
      },
      error:(error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  getAllCategories(){
    this.categoryService.getAllCategory().subscribe({
      next: (data) => {
        this.categories = data.body
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  onSubmit(){
    if(this.isAdmin){
      this.post = {
        postTitle:this.updatePostForm.get('postTitle')?.value,
        postContent:this.updatePostForm.get('postContent')?.value,
        categoryId:this.updatePostForm.get('categoryId')?.value,
        status:this.updatePostForm.get('status')?.value,
        userId:this.userId,
      }
    } else {
      this.post = {
        postTitle:this.updatePostForm.get('postTitle')?.value,
        postContent:this.updatePostForm.get('postContent')?.value,
        categoryId:this.updatePostForm.get('categoryId')?.value,
        userId:this.userId
      }
    }
    
    this.updatePost(this.post,this.postId);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  updatePost(post:Post, postId:number){
    let formData = new FormData();
    formData.append("image", this.file);
    formData.append("postData",JSON.stringify(post));
    this.postService.updatePost(formData,postId).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.updatePostForm.reset();
        this.router.navigate([`admin/posts`])
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
