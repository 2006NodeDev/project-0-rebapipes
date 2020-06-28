import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOtoReimbursementConvertor( udto:ReimbursementDTO):Reimbursement{
    return {
        reimbursementId:udto.reimbursementId, // primary key
            author: udto.author,  // foreign key -> User, not null
            amount: udto.amount,  // not null
        dateSubmitted: udto.dateSubmitted, // not null
        dateResolved: udto.dateResolved, // not null
        description: udto.description, // not null
        resolver: udto.resolver, // foreign key -> User
        status: udto.status, // foreign key -> ReimbursementStatus, not null
        type: udto.type, // foreign key -> ReimbursementType
    }
}
