import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/model/post';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.css']
})
export class PostPreviewComponent implements OnInit{

  isAdmin!: boolean;
  post!: Post;
  user!: User;
  postId!: number;
  userId!: number;
  name!: string;

  constructor(private authService : AuthService, 
    private activateRoute: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private _snackBar: MatSnackBar){
    
  }

  ngOnInit(): void {
  //  this.isAdmin = this.authService.isAdminUser(this.authService.getUserInfo());
  //  this.userId = this.authService.getUserInfo().userId!;
    this.postId = this.activateRoute.snapshot.params['postId'];
    this.getPost(this.postId);  
    //this.getFullName(this.post?.user!);
  }

  getPost(postId:number){
    this.postService.getPost(postId).subscribe({
      next: (data) => {
        this.post = data.body;  
      },
      error:(error) => {
        this._snackBar.open(error.error?.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  editPost(){
        
    this.updatePost(this.post,this.postId);
  }

  updatePost(post:Post, postId:number){
  }

  // getFullName(user: User){
  //   this.name = user?.firstName;
  //   if(user?.middleName) {
  //     this.name+=" "+user.middleName;
  //   }
  //   if(user?.lastName){
  //     this.name+=" "+user.lastName;
  //   }
  // }

  getFullName(post: Post){
    this.user = post.user!;
    let fullName = this.user?.firstName;
    if(this.user.middleName) {
      fullName+=" "+this.user.middleName;
    }
    if(this.user.lastName){
      fullName+=" "+this.user.lastName;
    }
    return fullName;
  }


}
