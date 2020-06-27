export abstract class HttpError extends Error {
    StatusCode:number
    constructor(StatusCode:number, message?:string) {
        super(message)
        this.StatusCode = StatusCode
    }
}
