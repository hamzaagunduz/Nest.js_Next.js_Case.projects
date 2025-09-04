export class BaseResponse<T> {
    success: boolean;
    data: T;
    message?: string;

    constructor(data: T, success = true, message?: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
