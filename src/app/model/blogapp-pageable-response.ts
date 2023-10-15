export interface BlogappPageableResponse<T> {

    content: T;
    pageNumber:number;
    pageSize:number;
    totalElement:number;
    totalPages:number;
    isLast:boolean;
    isFirst:boolean;
}
