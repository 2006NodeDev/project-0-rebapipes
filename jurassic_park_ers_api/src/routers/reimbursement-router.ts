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

reimbursementRouter.post('/', (req:Request, res:Response, next:NextFunction)=>{
    let {
        reimbursementId = 0,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type
    } = req.body
    if(reimbursementId && author && amount && dateSubmitted && dateResolved && description && resolver && status && type){
        reimbursements.push({reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type})
        res.status(201).send(reimbursements[reimbursements.length-1]);
    } else{
        console.log(`reimbursement id: ${reimbursementId}`)
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

export let users:User[] =[
    {
        reimbursementId: 1, // primary key
            author: number,  // foreign key -> User, not null
            amount: 4126.59,  // not null
        dateSubmitted: 1/1/1990, // not null
        dateResolved: 1/2/1990, // not null
        description: 'Repaired Jeep Brontosaurus stepped on', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 2, // primary key
            author: number,  // foreign key -> User, not null
            amount: 700.83,  // not null
        dateSubmitted: 2/12/1990, // not null
        dateResolved: 2/13/1990, // not null
        description: 'Replaced park gate Dracorex destroyed', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 3, // primary key
            author: number,  // foreign key -> User, not null
            amount: 2091.44,  // not null
        dateSubmitted: 3/23/1990, // not null
        dateResolved: 3/24/1990, // not null
        description: 'Materials to build playground for dinosaurs', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 4, // primary key
            author: number,  // foreign key -> User, not null
            amount: 89.71,  // not null
        dateSubmitted: 4/3/1990, // not null
        dateResolved: 4/4/1990, // not null
        description: 'Purchased chupacabras to feed to Velociraptors', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 5, // primary key
            author: number,  // foreign key -> User, not null
            amount: 66305.00,  // not null
        dateSubmitted: 5/14/1990, // not null
        dateResolved: 5/15/1990, // not null
        description: 'Hired groundskeeper to dispose of dinosaur poo', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 6, // primary key
            author: number,  // foreign key -> User, not null
            amount: 146.99,  // not null
        dateSubmitted: 6/25/1990, // not null
        dateResolved: 6/26/1990, // not null
        description: 'Acquired Pawpawsaurus from Fort Worth, Texas', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 7, // primary key
            author: number,  // foreign key -> User, not null
            amount: 347.50,  // not null
        dateSubmitted: 7/30/1990, // not null
        dateResolved: 7/31/1990, // not null
        description: 'Replaced Technosaurus that was eaten by T-Rex', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 8, // primary key
            author: number,  // foreign key -> User, not null
            amount: 1234.56,  // not null
        dateSubmitted: 8/7/1990, // not null
        dateResolved: 8/8/1990, // not null
        description: 'Materials to build ocean habitat for Mosasaurus', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 9, // primary key
            author: number,  // foreign key -> User, not null
            amount: 3623.58,  // not null
        dateSubmitted: 9/16/1990, // not null
        dateResolved: 9/17/1990, // not null
        description: 'Replaced fence Triceratops tore through', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 10, // primary key
            author: number,  // foreign key -> User, not null
            amount: 44000.01,  // not null
        dateSubmitted: 10/29/1990, // not null
        dateResolved: 10/30/1990, // not null
        description: 'Hired new trainer - Alec was eaten by Allosaurus', // not null
        resolver: number, // foreign key -> User
        status: number, // foreign key -> ReimbursementStatus, not null
        type: number // foreign key -> ReimbursementType
    },
]
