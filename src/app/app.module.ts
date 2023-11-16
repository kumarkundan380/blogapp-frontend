import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { HeaderComponent} from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RolesComponent } from './pages/roles/roles.component';
import { AddressComponent } from './pages/address/address.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderModule,NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { AddAddressComponent } from './pages/add-address/add-address.component';
import { EditAddressComponent } from './pages/edit-address/edit-address.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { UpdateCategoryComponent } from './pages/update-category/update-category.component';
import { PostsComponent } from './pages/posts/posts.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { UpdatePostComponent } from './pages/update-post/update-post.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PostPreviewComponent } from './pages/post-preview/post-preview.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ConfirmDialogComponent,
    SidebarComponent,
    AdminDashboardComponent,
    AdminHomeComponent,
    LoginComponent,
    ProfileComponent,
    RolesComponent,
    AddressComponent,
    UserDashboardComponent,
    UpdateUserComponent,
    UserListComponent,
    SignupComponent,
    AddAddressComponent,
    EditAddressComponent,
    CategoriesComponent,
    AddCategoryComponent,
    UpdateCategoryComponent,
    PostsComponent,
    CreatePostComponent,
    UpdatePostComponent,
    PostPreviewComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbNavModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    NgxUiLoaderModule,
    CKEditorModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true })
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
