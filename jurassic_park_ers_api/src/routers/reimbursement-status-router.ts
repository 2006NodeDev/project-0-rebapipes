import express, { Request, Response, NextFunction } from 'express';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getReimbursementsByStatus } from '../dao/reimbursement-status-dao';

export const reimbursementStatusRouter = express.Router();

// Get Reimbursement by Status

reimbursementStatusRouter.get('/:statusId', authorizationMiddleware(['admin', 'finance-manager', 'current']), async (req:Request, res:Response, next:NextFunction)=>{
    let{statusId} = req.params;
    if(isNaN(+statusId)){
        res.status(400).send("Id must be a number")
    } else{
        try {
            let reimbursement = await getReimbursementsByStatus(+statusId);
            res.json(reimbursement);
        } catch (error) {
            next(error);
        }
    }
})
