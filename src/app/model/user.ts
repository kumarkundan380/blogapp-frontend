import { Role } from "./role";
import { Address } from "./address";
export interface User {

    userId?: number;
    firstName: string;
    lastName: string;
    middleName: string;
    userName: string;
    password?: string;
    phoneNumber: string;
    userImage?: string;
    gender: string;
    about: string;
    userStatus?:string;
    isVerified?:boolean;
    addresses?:Address[];
    roles?:Role[];
    createdAt?:string;
    updatedAt?:string;
    isAccountExpired?:boolean;
    isCredentialsExpired?:boolean;
    isAccountLocked?:boolean;

}
