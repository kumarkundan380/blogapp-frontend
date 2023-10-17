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


const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'profile',
    component: ProfileComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path:'',
        component: UserListComponent
      },
      {
        path:':userId/roles',
        component: RolesComponent
      }
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
    path: 'address/:userId/:addressId',
    component: EditAddressComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
