import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOtoReimbursementConvertor(
  r: ReimbursementDTO
): Reimbursement {
  return {
    reimbursementId: r.reimbursement_id,
    author: r.author,
    amount: r.amount,
    dateSubmitted: r.date_submitted.getFullYear(),
    dateResolved: r.date_resolved.getFullYear(),
    description: r.description,
    resolver: r.resolver,
    status: r.status,
    type: r.type,
  };
}
