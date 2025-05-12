import { User } from "./user";

export interface Activity {

    activityId?: number;
    activityType : string;
    entityType: string;
    user: User;
    postId?: number;
    commentId?: number;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
    version?: number;

}
