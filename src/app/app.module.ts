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
import { EditorModule } from '@tinymce/tinymce-angular';
import { PostPreviewComponent } from './pages/post-preview/post-preview.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { StripHtmlPipe } from './strip-html.pipe';
import { HomeRedirectComponent } from './pages/home-redirect/home-redirect.component';
import { PostCardComponent } from './pages/post-card/post-card.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { ContactMessageComponent } from './pages/contact-message/contact-message.component';
import { ViewMessageDialogComponent } from './components/view-message-dialog/view-message-dialog.component';


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
    ForgotPasswordComponent,
    ChangePasswordComponent,
    VerifyEmailComponent,
    StripHtmlPipe,
    HomeRedirectComponent,
    PostCardComponent,
    AboutUsComponent,
    ContactUsComponent,
    ThankYouComponent,
    ContactMessageComponent,
    ViewMessageDialogComponent
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
    EditorModule,
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
