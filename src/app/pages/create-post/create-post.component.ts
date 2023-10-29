import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { Post } from 'src/app/model/post';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  createPostForm!: FormGroup;
  post!: Post;
  userId!:number;
  file!:Blob;
  selectedFile: File | null = null;
  imageSrc: string | ArrayBuffer | null | undefined = null;
  categories!: Category[];
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
    this.userId = this.authService.getUserInfo().userId!;
    this.getAllCategories();
    this.createPostForm = this.formBuilder.group({
      postTitle: new FormControl('',Validators.required),
	    postContent: new FormControl('',Validators.required),
	    categoryId: new FormControl('', Validators.required)
    });
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
    this.post = {
      postTitle:this.createPostForm.get('postTitle')?.value,
      postContent:this.createPostForm.get('postContent')?.value,
      categoryId:this.createPostForm.get('categoryId')?.value,
      userId:this.userId
    }
    this.createPost(this.post);
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

  createPost(post:Post){
    let formData = new FormData();
    formData.append("image", this.file);
    formData.append("postData",JSON.stringify(post));
    this.postService.createPost(formData).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.createPostForm.reset();
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
