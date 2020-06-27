import {HttpError} from "./HttpError";

export class LoginInvalidCredentialsError extends HttpError {
    constructor() {
        super(400, 'Invalid Credentials')
    }
}
