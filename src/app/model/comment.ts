import { Post } from "./post";
import { User } from "./user";

export interface Comment {

    commentId?: number;
    content: string;
    post: Post;
    user: User;
    postId?: number;
    userId?: number;
    createdAt?: string;
    updatedAt?: string;
}
