import { HttpError } from "./HttpError";

export class ReimbursementIdInputError extends HttpError{
    constructor(){
        super(400, 'Reimbursement ID must be a number')
    }
}
