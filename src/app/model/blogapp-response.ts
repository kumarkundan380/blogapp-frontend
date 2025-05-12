export interface BlogAppResponse<T> {

    status: ResponseStatus; 
    message:string;
    body: T;
}

export enum ResponseStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    FAILURE = "FAILURE"
}
