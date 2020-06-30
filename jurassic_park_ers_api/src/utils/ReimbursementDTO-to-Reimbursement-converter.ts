import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementStatus } from "../models/ReimbursementStatus";
import { ReimbursementType } from "../models/ReimbursementType";

export function ReimbursementDTOtoReimbursementConverter(rto: ReimbursementDTO): Reimbursement {
  let status:ReimbursementStatus = ({ statusId:rto.status_id, status:rto.status });
  let type:ReimbursementType = ({ typeId:rto.type_id, type:rto.type });
  return {
    reimbursementId: rto.reimbursement_id,
    author: rto.author,
    amount: rto.amount,
    dateSubmitted: rto.date_submitted.getFullYear(),
    dateResolved: rto.date_resolved.getFullYear(),
    description: rto.description,
    resolver: rto.resolver,
    status
    type
  };
}
