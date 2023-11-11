import { Category } from "./category";
import { User } from "./user";
import { Comment } from "./comment";

export interface Post {

    postId?:number;
    postTitle:string;
    postContent:string;
    imageUrl?:string;
    category?:Category;
    user?:User;
    comments?:Comment[];
    userId?:number;
    categoryId:number;
    status?:string;
    createdAt?:string;
    updatedAt?:string;
}
