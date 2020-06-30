import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTO } from "../dtos/reimbursement-dto";


export function ReimbursementDTOtoReimbursementConverter(rdto: ReimbursementDTO): Reimbursement {
  return {
    reimbursementId: rdto.reimbursement_id,
    author: rdto.author,
    amount: rdto.amount,
    dateSubmitted: rdto.date_submitted.getFullYear(),
    dateResolved: rdto.date_resolved.getFullYear(),
    description: rdto.description,
    resolver: rdto.resolver,
    status: rdto.status,
    type: rdto.type,
  };
}
