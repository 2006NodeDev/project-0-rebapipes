import { HttpError } from "./HttpError";

export class AuthenticationError extends HttpError {
    constructor(){
        super(401, 'Incorrect Username or Password')
    }
}
