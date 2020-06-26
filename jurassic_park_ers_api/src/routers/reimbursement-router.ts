import express, { Request, Response, NextFunction } from 'express'
import { ReimbursementUserInputError } from '../errors/ReimbursementUserInputError'
import { ReimbursementIdInputError } from '../errors/ReimbursementIdInputError'
import { getAllReimbursements, findreimbursementById } from '../daos/reimbursement-dao'

export let reimbursementRouter = express.Router()

reimbursementRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let reimbursements = await getAllReimbursements()
        res.json(reimbursements)
    } catch (e) {
        next(e)
    }

})

// for saving a new reimbursement
// this endpoint will run all the middleware functions one at a time
reimbursementRouter.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    let { reimbursementId,
        users,
        } = req.body // destructuring
    // warning: if data is allowed to be null or 0, or false, this check is not sufficient
    if (reimbursementId && users && (! && typeof ( ) === 'boolean' || ) && ) {
        // reimbursements.push({ reimbursementId, users })
        // sendStatus just sents an empty response with the status code provided
        res.sendStatus(201) // 201 is created
    } else {
        // .status sets the status code but deson't send res
        // .send can send a response in many different content-types
        throw new ReimbursementUserInputError()
    }
})

// express supports path params natively by putting : in the path
// express takes the value in the : and puts it on the request object
reimbursementRouter.get('/:id', async (req: Request, res: Response, next:NextFunction) => {
    let { id } = req.params // destructring
    // goal is to return a specific reimbursement that matches the id we got
    // the id could be bad - string instead of a number -- ReimbursementIdInputError
    // the id could not exist -- ReimbursementNotFound
    if (isNaN(+id)) { // we can use the + to convert a variable to a number - node says do it this way
        next(new ReimbursementIdInputError()) //we didn't get a number in the path
    } else {
        try {
            let reimbursement = await findreimbursementById(+id)
            res.json(reimbursement)
        } catch(e){
            next(e)
        }
    }
})
