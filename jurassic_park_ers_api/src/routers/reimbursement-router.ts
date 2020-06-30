import express, { Request, Response, NextFunction } from 'express'
import {findReimbursementByStatus, getReimbursementsByUser} from '../daos/reimbursement-dao'

export const reimbursementRouter = express.Router()


reimbursementRouter.get('/status/:statusId', async (req: Request, res: Response, next:NextFunction) => {
    let {statusId} = req.params
    if (isNaN(+statusId)) {
        next(new Error('Id must be a number'))
    } else {
        try {
            let reimbursement = await findReimbursementByStatus(+statusId)
            res.json(reimbursement)
        } catch(e){
            next(e)
        }
    }
})

reimbursementRouter.get('/author/userId/:id', async (req: Request, res: Response, next:NextFunction) => {
    let { id } = req.params
    if (isNaN(+id)) {
        next(new Error('Id must be a number'))
    } else {
        try {
            let reimbursement = await getReimbursementsByUser(+id)
            res.json(reimbursement)
        } catch(e){
            next(e)
        }
    }
})
