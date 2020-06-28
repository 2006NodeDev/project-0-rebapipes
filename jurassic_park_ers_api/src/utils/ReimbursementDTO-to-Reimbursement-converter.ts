import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOtoReimbursementConvertor( udto:ReimbursementDTO):Reimbursement{
    return {
        reimbursementId:udto.reimbursement_id, // primary key
            author: udto.author,  // foreign key -> User, not null
            amount: udto.amount,  // not null
        dateSubmitted: udto.dateSubmitted, // not null
        dateResolved: udto.dateResolved, // not null
        description: udto.description, // not null
        resolver: udto.resolver, // foreign key -> User
        status: udto.ReimbursementStatus, // foreign key -> ReimbursementStatus, not null
        type: udto.ReimbursemenType, // foreign key -> ReimbursementType
    }
}
