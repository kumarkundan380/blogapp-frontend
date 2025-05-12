import { Gender, UserStatus } from "./user";

export interface UserSearchRequest {

    readonly userId?: number;
    userName?: string;
    email?: string;         
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: string;          
    gender?: Gender;        
    status?: UserStatus; 
    emailVerified?: boolean; 
}
