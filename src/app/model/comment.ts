import { Activity } from "./activity";
import { Post } from "./post";
import { User } from "./user";

export interface Comment {

    commentId?: number;
    content: string;
    post: Post;
    user: User;
    postId?: number;
    userId?: number;
    activities?:Activity[];
    createdAt?: string;
    updatedAt?: string;
    isCommentLiked?:boolean;
    isCommentDisliked?:boolean;
    commentLikedCount?: number;
    commentDisLikedCount?: number;
    version?: number;
    isEdited: boolean;
}
