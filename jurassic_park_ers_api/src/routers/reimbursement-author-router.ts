import express, { Request, Response, NextFunction } from 'express';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getReimbursementsByUser } from '../dao/reimbursement-author-dao';

export const reimbursementAuthorRouter = express.Router();

// Get Reimbursement by Author (User)

reimbursementAuthorRouter.get('/:userId', authorizationMiddleware(['admin', 'finance-manager', 'current']), async (req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.params;

    if(isNaN(+userId)){
        res.status(400).send("Id must be a number")
    }else {
        try {
            let reimbursement = await getReimbursementsByUser(+userId);
            res.json(reimbursement);
        } catch (error) {
            next(error);
        }
    }
});
