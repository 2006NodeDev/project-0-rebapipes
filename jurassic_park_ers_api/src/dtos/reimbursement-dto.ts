import { ReimbursementStatus } from "../models/ReimbursementStatus"
import { ReimbursementType } from "../models/ReimbursementType"

export class ReimbursementDTO {
    reimbursement_id: number 
        author: number  
        amount: number 
    dateSubmitted: number 
    dateResolved: number 
    description: string 
    resolver: number 
    status: ReimbursementStatus 
    status_id: number
    type: ReimbursementType
    type_id: number
}
