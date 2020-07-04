import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/reimbursement";

//ReimbursementDTO takes objects in DB format & converts it to Reimbursement model object(s)
export function ReimbursementDTOtoReimbursementConverter(rdto: ReimbursementDTO): Reimbursement {
    return {
        reimbursementId: rdto.reimbursement_id,
        author: rdto.author,
        amount: rdto.amount,
        dateSubmitted: new Date(rdto.date_submitted), //rdto.date_submitted.getFullYear(),
        dateResolved: new Date(rdto.date_resolved),//rdto.date_resolved.getFullYear(),
        description: rdto.description,
        resolver: rdto.resolver,
        status: {
            status: rdto.status,
            statusId: rdto.status_id
        },
        type: {
            type: rdto.type,
            typeId: rdto.type_id
        }
    }
}
