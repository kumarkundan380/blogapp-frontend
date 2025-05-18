import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import { RolesComponent  } from './pages/roles/roles.component';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { AdminGuard } from './guards/admin.guard';
import { LoginGuard } from './guards/login.guard';
import { AddAddressComponent } from './pages/add-address/add-address.component';
import { AddressComponent } from './pages/address/address.component';
import { EditAddressComponent } from './pages/edit-address/edit-address.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { UpdateCategoryComponent } from './pages/update-category/update-category.component';
import { PostsComponent } from './pages/posts/posts.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { UpdatePostComponent } from './pages/update-post/update-post.component';
import { PostPreviewComponent } from './pages/post-preview/post-preview.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { HomeRedirectComponent } from './pages/home-redirect/home-redirect.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { ContactMessageComponent } from './pages/contact-message/contact-message.component';


const routes: Routes = [
  {
    path: '',
    component: HomeRedirectComponent
  },
  {
    path: 'posts',
    component: PostsComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
    // canActivate: [NoAuthGuard]
  },
  { 
    path: 'about-us', 
    component: AboutUsComponent 
  },
  { 
    path: 'contact-us', 
    component: ContactUsComponent,
    canActivate: [LoginGuard] 
  },
  { 
    path: 'thank-you', 
    component: ThankYouComponent,
    canActivate: [LoginGuard] 
  },
  {
    path: 'posts/:slug',
    component: PostPreviewComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'forgot-password/:token',
    component: ChangePasswordComponent
  },
  {
    path: 'verify-email/:token',
    component: VerifyEmailComponent
  },
  {
    path:'profile/:userId',
    component: ProfileComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard], // Protects all child routes
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'update-user/:userId', component: UpdateUserComponent },
      { path: 'all-address/:userId', component: AddressComponent },
      { path: 'add-address/:userId', component: AddAddressComponent},
      { path: 'edit-address/:userId/:addressId', component: EditAddressComponent },
      { path: ':userId/roles', component: RolesComponent },
      { path: 'profile/:userId', component: ProfileComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'add-category', component: AddCategoryComponent },
      { path: 'update-category/:categoryId', component: UpdateCategoryComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'contact-messages', component: ContactMessageComponent }
    ]
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'update-user/:userId',
    component: UpdateUserComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'add-address/:userId',
    component: AddAddressComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'all-address/:userId',
    component: AddressComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'edit-address/:userId/:addressId',
    component: EditAddressComponent,
    canActivate: [LoginGuard]
  },
  {
    path:'create-post',
    component: CreatePostComponent,
    canActivate: [LoginGuard]
  },
  {
    path:'update-post/:slug',
    component: UpdatePostComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
