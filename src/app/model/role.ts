export interface Role {

    readonly roleId?: number;
    roleName: RoleType;
    description?:string
    version?: number;
}

export enum RoleType {
    
    ADMIN = "ADMIN",
    USER = "USER",
    SUPER_ADMIN = "SUPER ADMIN",
    MODERATE = "MODERATE"
}
