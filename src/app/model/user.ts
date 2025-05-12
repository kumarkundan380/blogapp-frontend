import { Role } from "./role";
import { Address } from "./address";

export interface User {
    
    readonly userId?: number; // Optional because new users won't have an ID
    userName: string;
    email: string;
    password?: string; // Optional since it's hidden in JSON response
    firstName: string;
    middleName?: string; // Optional as per backend
    lastName?: string; // Optional
    about?: string; // Optional
    userImage?: string; // Optional
    gender?: Gender; // Enum for Gender
    phoneNumber?: string; // Optional
    active?: boolean; // Boolean for status
    emailVerified?: boolean; // Boolean for email verification
    status?: UserStatus; // Enum for UserStatus
    roles?: Role[]; // Role array (must define Role interface)
    addresses?: Address[]; // Address array (must define Address interface)
    createdAt?: Date; // Convert LocalDateTime to JS Date
    updatedAt?: Date; // Convert LocalDateTime to JS Date
    version?: number;
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHERS = "OTHERS"
}
  
export enum UserStatus {
    ACTIVE = "ACTIVE",
    DELETED = "DELETED",
    PENDING = "PENDING"
}
