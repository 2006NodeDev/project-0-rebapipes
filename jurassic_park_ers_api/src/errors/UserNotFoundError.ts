import { HttpError } from "./HttpError";

export class UserNotFoundError extends HttpError {
    constructor () {
        super(400,'User Not Found')
    }
}
