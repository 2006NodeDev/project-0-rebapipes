import { HttpError } from "./HttpError";

export class ReimbursementUserInputError extends HttpError {
    constructor(){
        super(400, 'Please Fill Out All Reimbursemet Fields')
    }
}
