import { HttpError } from "./HttpError";

export class ReimbursementInputError extends HttpError {
    constructor() {
        super(400, 'Please fill out all fields')
    }
}
