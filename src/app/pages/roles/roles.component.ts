import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, RoleType } from 'src/app/model/role';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles: FormControl = new FormControl([]);
  roleList: Role[] = [];
  userId: number = 0;
  userRole: Role[] = [];
  haveSuperAdminRole: boolean = false;
  haveAdminRole: boolean = false;
  haveModerateRole: boolean = false;
  haveUserRole: boolean = false;
  isAddRoleButton: boolean = true;
  isAddRole: boolean = false;
  isCurrentUserSuperAdminRole: boolean = false;
  isCurrentUserAdminRole: boolean = false;
  isCurrentUserModerateRole: boolean = false;
  isCurrentUserUserRole: boolean = false;
  currentUser: User = this.authService.getUserInfo()!;

  constructor(private userService: UserService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private authService: AuthService, 
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {

    this.userId = this.activateRoute.snapshot.params['userId'];
    this.loadRolesData();
  }

  private loadRolesData(): void {
    
    forkJoin({
      allRoles: this.userService.getAllRoles(),
      userRoles: this.userService.getRolesByUserId(this.userId)
    }).subscribe({
      next: ({ allRoles, userRoles }) => {
        this.roleList = allRoles.body || [];
        this.userRole = userRoles.body || [];
        this.checkCurrentUserRole();
        this.checkRole();
        this.showAddRoleButton();
      },
      error: (error) => this.handleError(error)
    });
  }

  private showAddRoleButton(): void {
    const targetRoleNames = this.userRole.map(role => role.roleName);
    const availableRoleNames = this.roleList.map(role => role.roleName);
  
    const isSelf = this.currentUser?.userId === this.userId;
  
    if (this.isCurrentUserSuperAdminRole) {
      if (isSelf) {
        // Show button if self is missing any role from system
        this.isAddRoleButton = availableRoleNames.some(role => !targetRoleNames.includes(role));
      } else {
        // Show button if target is missing any non-super-admin role
        const nonSuperAdminRoles = availableRoleNames.filter(role => role !== RoleType.SUPER_ADMIN);
        this.isAddRoleButton = nonSuperAdminRoles.some(role => !targetRoleNames.includes(role));
      }
      return;
    }
  
    if (this.isCurrentUserAdminRole) {
      if (isSelf) {
        // Show button if self is missing any non-super-admin role
        const assignableRoles = availableRoleNames.filter(role => role !== RoleType.SUPER_ADMIN);
        this.isAddRoleButton = assignableRoles.some(role => !targetRoleNames.includes(role));
      } else {
        // Show button if target is non-admin and missing any non-super-admin or non-admin role
        const assignableRoles = availableRoleNames.filter(role =>
          role !== RoleType.SUPER_ADMIN && role !== RoleType.ADMIN
        );
        this.isAddRoleButton = assignableRoles.some(role => !targetRoleNames.includes(role));
      }
      return;
    }
  
    // Other roles (moderate/user) – optional logic, can default to false or add rules
    this.isAddRoleButton = false;
  }
  

  private filterRoleList() {
    this.roleList = this.roleList.filter(role => role.roleName !== RoleType.SUPER_ADMIN);
    if(this.isCurrentUserAdminRole) {
      this.roleList = this.roleList.filter(role => role.roleName !== RoleType.ADMIN);
    }
  }

  private checkCurrentUserRole() : void {
    if(this.authService.isSuperAdminUser(this.currentUser)) {
      this.isCurrentUserSuperAdminRole = true;
    } else if(this.authService.isAdminUser(this.currentUser)) {
      this.isCurrentUserAdminRole = true;
    } else if(this.authService.isModerateUser(this.currentUser)){
      this.isCurrentUserModerateRole = true
    } else {
      this.isCurrentUserUserRole =true;
    }
  }
  
  private checkRole(): void {
    
    const roleNames = this.userRole.map((role: Role) => role.roleName);
    this.haveSuperAdminRole = roleNames.includes(RoleType.SUPER_ADMIN);
    this.haveAdminRole = roleNames.includes(RoleType.ADMIN);
    this.haveModerateRole = roleNames.includes(RoleType.MODERATE);
    this.haveUserRole = roleNames.includes(RoleType.USER);
  }

  private handleError(error: any): void {
    
    const errorMessage = error?.error?.errorMessage || 'An error occurred';
    this._snackBar.open(errorMessage, 'OK', {
      duration: 3000,
      verticalPosition: 'top'
    });

  }

  onSubmit(): void {
    
    const selectedRoles = this.roles.value;
    this.userService.addRolesByUserId(this.userId, selectedRoles).subscribe({
      next: ({ message }) => {
        this._snackBar.open(message, 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.isAddRole = false;
        // Force reload the current component
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/admin/${this.userId}/roles`]);
        });
      },
      error: (error) => this.handleError(error)
    });
  }

  addRole(): void {
    
    this.isAddRole = true;
    this.filterRoleList();
    this.roleList = (this.roleList || []).filter(
      role => !this.userRole.some(userRole => userRole.roleId === role.roleId)
    );
  }

  private checkIsSelfTarget(): boolean {
    return String(this.currentUser?.userId) === String(this.userId);
  }

  canRemoveRole(role: Role): boolean {

    const isSelfTarget = this.checkIsSelfTarget();
   
    // Rule 1: Never allow removing the last role
    if (this.userRole.length <= 1) return false;

    // Rule 2: Never allow removing USER role
    if (role.roleName === RoleType.USER) return false;

    // Super Admin logic
    if (this.isCurrentUserSuperAdminRole) {
    
      // Cannot remove any of their own roles
      if (isSelfTarget) return false;

      // Cannot remove USER role from any user
      if (this.haveUserRole && (role.roleName as RoleType) === RoleType.USER) return false;

      // Can remove other roles
      return true;
    }

    //Admin logic
    if (this.isCurrentUserAdminRole) {
      
      // Cannot remove own roles
      if (isSelfTarget) return false;
      
      // Cannot remove from another Admin
      if (this.haveAdminRole) return false;

      // Cannot remove USER role
      if (role.roleName === RoleType.USER as RoleType) return false;

      // Can remove MODERATE or other roles from non-admins
      return true;
    }
    // Default: other users cannot remove any role
    return false;
  }
   
  removeRole(role: Role): void {
    
    this.userService.removeRoleByUserId(this.userId, role).subscribe({
      next: ({ message }) => {
        this._snackBar.open(message, 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
        // Force reload the current component
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/admin/${this.userId}/roles`]);
        });
      },
      error: (error) => this.handleError(error)
    });
  }


}
