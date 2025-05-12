import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogappPageableResponse } from 'src/app/model/blogapp-pageable-response';
import { Gender, User, UserStatus } from 'src/app/model/user';
import { UserSearchRequest } from 'src/app/model/user-search-request';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  users: BlogappPageableResponse<User[]>;
  searchUserForm!: FormGroup;
  dialogSubscription!: Subscription;
  isSuperAdmin = false;
  isAdmin = false;
  searchList = [
    { label: 'Username', value: 'Username', type: 'text' },
    { label: 'First Name', value: 'First Name', type: 'text' },
    { label: 'Middle Name', value: 'Middle Name', type: 'text' },
    { label: 'Last Name', value: 'Last Name', type: 'text' },
    { label: 'Email Id', value: 'Email Id', type: 'text' },
    { label: 'Phone Number', value: 'Phone Number', type: 'text' },
    { label: 'Gender', value: 'Gender', type: 'dropdown', options: Object.values(Gender) },
    { label: 'Email Verified', value: 'Email Verified', type: 'dropdown', options: ['YES', 'NO'] },
    { label: 'Status', value: 'Status', type: 'dropdown', options: Object.values(UserStatus) }
  ];
  selectedSearchType: 'text' | 'dropdown' = 'text';
  searchOptions: string[] = [];
  

  constructor(private userService : UserService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService,
    private authService: AuthService){ 
      this.users = {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElement: 0,
        totalPages: 0,
        isFirst: true,
        isLast: true
      };
  }
  
  ngOnInit(): void {

    this.initializeForm();
    this.initializeRoles();
    this.searchUserForm.get('searchKey')?.valueChanges.subscribe(() => this.onSearchKeyChange());
    this.getUsers(this.buildSearchRequest());
  }

  private initializeRoles(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.isSuperAdmin = this.authService.isSuperAdminUser(userInfo);
      this.isAdmin = this.authService.isAdminUser(userInfo);
    }
  }

  ngOnDestroy(): void {
    if(this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
   
  }

  private initializeForm(): void {
    this.searchUserForm = this.formBuilder.group({
      searchKey: [''],
      searchValue: ['']
    });
  }

  private getUsers(userSearchRequest: UserSearchRequest): void {
    this.userService.getAllUser(userSearchRequest).subscribe({
      next: (data) => this.users = data.body,
      error: (error) => this.showSnackBar(error.error.message)
    });
  }

  onPageChange(pageNumber: number): void {
    if (pageNumber === this.users.pageNumber) return; // Do nothing
    const userSearchRequest: UserSearchRequest = this.buildSearchRequest();
    this.userService.getAllUser(userSearchRequest, pageNumber).subscribe({
      next: (data) => this.users = data.body,
      error: (error) => this.showSnackBar(error.error.message)
    });
  }

  viewUser(user: User): void {
    if(this.isSuperAdmin || this.isAdmin) {
      this.router.navigate([`/admin/profile/${user.userId}`]);
    } else {
      this.router.navigate([`/profile/${user.userId}`]);
    }
  }

  updateUser(user: User): void {
    if(this.isSuperAdmin || this.isAdmin) {
      this.router.navigate([`/admin/update-user/${user.userId}`]);
    } else {
      this.router.navigate([`/update-user/${user.userId}`]);
    }
  }

  deleteUser(user: User): void {
    this.dialogSubscription = this.dialogService.openConfirmDialog('Are you sure you want to remove this user?')
      .afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.userService.deleteUser(user.userId!).subscribe({
            next: (data) => {
              this.showSnackBar(data.message);
              this.getUsers(this.buildSearchRequest());
            },
            error: (error) => this.showSnackBar(error.error.message)
          });
        }
      });
  }

  getFullName(user: User): string {
    return [user.firstName, user.middleName, user.lastName]
      .filter(name => !!name)
      .join(' ');
  }

  onSubmit(): void {

    const searchKey = this.searchUserForm.get('searchKey')?.value;
    const searchValue = this.searchUserForm.get('searchValue')?.value;
    if (!searchKey || searchValue === null || searchValue === undefined || searchValue === '') {
      return; // Don't proceed if either field is empty
    }
    this.getUsers(this.buildSearchRequest());

  }

  onReset(): void {
    this.searchUserForm.reset();
     // Force reload the current component
     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/admin/user-list`]);
    });
  }

  onSearchKeyChange(): void {
    const selected = this.searchList.find(option => option.value === this.searchUserForm.get('searchKey')?.value);
    this.selectedSearchType = (selected?.type as 'text' | 'dropdown') || 'text';
    this.searchOptions = selected?.options || [];
    this.searchUserForm.get('searchValue')?.reset();
  }

  private buildSearchRequest(): UserSearchRequest {

    const searchKey = this.searchUserForm.get('searchKey')?.value;
    const searchValue = this.searchUserForm.get('searchValue')?.value;
    const searchMap: Record<string, Partial<UserSearchRequest>> = {
      "Username": { userName: searchValue },
      "First Name": { firstName: searchValue },
      "Middle Name": { middleName: searchValue },
      "Last Name": { lastName: searchValue },
      "Phone Number": { phoneNumber: searchValue },
      "Gender": { gender: searchValue as Gender },
      "Email Verified": { emailVerified: searchValue.toUpperCase() === "YES" },
      "Status": { status: searchValue as UserStatus }
    };

    return searchMap[searchKey] || {};
  }

  trackByUserId(index: number, user: User): number {
    return user.userId!;
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.users?.totalPages || 0 }, (_, i) => i);
  }

  private showSnackBar(message: string): void {
    this._snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
