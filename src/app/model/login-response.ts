import { User } from "./user";
export interface LoginResponse {

    accessToken: string;
    refreshToken: string;
    accessExpiresIn: number;   // Access token expiry time (seconds)
    refreshExpiresIn: number;  // Refresh token expiry time (seconds)
    user: User;
}
