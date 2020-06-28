
import express, { Request, Response} from 'express';
import { reimbursements } from './reimbursement-router';

export const reimbursementStatusRouter = express.Router()

// Get Reimbursement by Status
reimbursementStatusRouter.get('/:statusId', (req:Request, res:Response)=>{
    let {statusId} = req.params
    if(isNaN(+statusId)){
        res.status(400).send('ID must be a number')
    } else {
        let found = false
        let found_reimbursements = []

        reimbursements.forEach(reimbursement => {
            if (reimbursement.status === +statusId) {
                found_reimbursements.push(reimbursement)
                res.json(reimbursement)
                found = true 
            }
        })
        if(!found){
            res.status(404).send('Reimbursement Not Found')
        }
    }
})
