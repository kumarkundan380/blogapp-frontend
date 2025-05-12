import { PostStatus } from "./post";

export interface PostSearchRequest {

    readonly postId?: number;
    readonly userId?: number| null;
    postTitle?: string;
    category?: string;
    userName?: string;
    postStatus?: PostStatus;
    createdAt?: Date;
    
}