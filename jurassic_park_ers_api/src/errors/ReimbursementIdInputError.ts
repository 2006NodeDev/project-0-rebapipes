import { HttpError } from "./HttpError";

export class ReimbursementIdInputError extends HttpError{
    constructor(){
        super(400, 'Reimbursement Id must be a number')
    }
}
