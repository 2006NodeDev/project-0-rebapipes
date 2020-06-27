import express, { Request, Response, NextFunction } from 'express'
import { Reimbursement, ReimbursementStatus, ReimbursementType } from "../models/Reimbursement";
import { ReimbursementUserInputError } from '../errors/ReimbursementUserInputError'
import { ReimbursementIdInputError } from '../errors/ReimbursementIdInputError'
import { getAllReimbursements, findreimbursementById } from '../daos/reimbursement-dao'
import { ReimbursementNotFoundError } from '../errors/ReimbursementNotFoundError';
import { reimbursementStatusRouter } from './reimbursementStatus-router';
import { reimbursementAuthorRouter } from './reimbursementAuthor-router';

export const reimbursementRouter = express.Router()

// Reimbursement by Status lookup
reimbursementRouter.use('/status', reimbursementStatusRouter);

// Reimbursement by Author (User) lookup
reimbursementRouter.use('/author', reimbursementAuthorRouter);

// Get all Reimbursements
reimbursementRouter.get('/', (req:Request,res:Response,next:NextFunction)=>{
    res.json(reimbursements)
})

// Submit a Reimbursement
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
        throw new ReimbursementIdInputError
    }
})

// Update a Reimbursement
reimbursementRouter.patch('/', (req:Request, res:Response, next:NextFunction)=>{
    let id = req.body.reimbursementId;
    if(!id){
        throw ReimbursementIdInputError
    }else if(isNaN(+id)){
        res.status(400).send("Reimbursement Id must be a number");
    }else{
        let found = false;
        for(const reimbursement of reimbursements){
            if(reimbursement.reimbursementId === +id){
                let author = req.body.author;
                let amount = req.body.amount;
                let dateSubmitted = req.body.dateSubmitted;
                let dateResolved = req.body.dateResolved;
                let description = req.body.description;
                let resolver = req.body.resolver;
                let status = req.body.status;
                let type = req.body.type;

                if(author){
                    reimbursement.author = author;
                }
                if(amount){
                    reimbursement.amount = amount;
                }
                if(dateSubmitted){
                    reimbursement.dateSubmitted = dateSubmitted;
                }
                if(dateResolved){
                    reimbursement.dateResolved = dateResolved;
                }
                if(description){
                    reimbursement.description = description;
                }
                if (resolver){
                    reimbursement.resolver = resolver;
                }
                if (status){
                    reimbursement.status = status;
                }
                if (type){
                    reimbursement.type = type;
                }

                res.json(reimbursement);
                found = true;
            }
        }
        if(!found){
            res.status(404).send('Reimbursment Not Found')
        }
    }
})

export let reimbursements:Reimbursement[] = [
    {
        reimbursementId: 1, // primary key
            author: 1,  // foreign key -> User, not null
            amount: 4126.59,  // not null
        dateSubmitted: 1/1/1990, // not null
        dateResolved: 1/2/1990, // not null
        description: 'Repaired Jeep Brontosaurus stepped on', // not null
        resolver: 2, // foreign key -> User
        status: 2, // foreign key -> ReimbursementStatus, not null
        type: 1 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 2, // primary key
            author: 2,  // foreign key -> User, not null
            amount: 700.83,  // not null
        dateSubmitted: 2/12/1990, // not null
        dateResolved: 2/13/1990, // not null
        description: 'Replaced park gate Dracorex destroyed', // not null
        resolver: 1, // foreign key -> User
        status: 2, // foreign key -> ReimbursementStatus, not null
        type: 1 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 3, // primary key
            author: 3,  // foreign key -> User, not null
            amount: 2091.44,  // not null
        dateSubmitted: 3/23/1990, // not null
        dateResolved: 3/24/1990, // not null
        description: 'Materials to build playground for dinosaurs', // not null
        resolver: 1, // foreign key -> User
        status: 3, // foreign key -> ReimbursementStatus, not null
        type: 1 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 4, // primary key
            author: 4,  // foreign key -> User, not null
            amount: 89.71,  // not null
        dateSubmitted: 4/3/1990, // not null
        dateResolved: 4/4/1990, // not null
        description: 'Purchased chupacabras to feed to Velociraptors', // not null
        resolver: 2, // foreign key -> User
        status: 2, // foreign key -> ReimbursementStatus, not null
        type: 3 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 5, // primary key
            author: 5,  // foreign key -> User, not null
            amount: 66305.00,  // not null
        dateSubmitted: 5/14/1990, // not null
        dateResolved: 5/15/1990, // not null
        description: 'Hired groundskeeper to dispose of dinosaur poo', // not null
        resolver: 1, // foreign key -> User
        status: 3, // foreign key -> ReimbursementStatus, not null
        type: 4 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 6, // primary key
            author: 6,  // foreign key -> User, not null
            amount: 146.99,  // not null
        dateSubmitted: 6/25/1990, // not null
        dateResolved: 6/26/1990, // not null
        description: 'Acquired Pawpawsaurus from Fort Worth, Texas', // not null
        resolver: 2, // foreign key -> User
        status: 2, // foreign key -> ReimbursementStatus, not null
        type: 2 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 7, // primary key
            author: 7,  // foreign key -> User, not null
            amount: 347.50,  // not null
        dateSubmitted: 7/30/1990, // not null
        dateResolved: 7/31/1990, // not null
        description: 'Replaced Technosaurus that was eaten by T-Rex', // not null
        resolver: 2, // foreign key -> User
        status: 2, // foreign key -> ReimbursementStatus, not null
        type: 2 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 8, // primary key
            author: 8,  // foreign key -> User, not null
            amount: 1234.56,  // not null
        dateSubmitted: 8/7/1990, // not null
        dateResolved: 8/8/1990, // not null
        description: 'Materials to build ocean habitat for Mosasaurus', // not null
        resolver: 2, // foreign key -> User
        status: 2, // foreign key -> ReimbursementStatus, not null
        type: 1 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 9, // primary key
            author: 9,  // foreign key -> User, not null
            amount: 3623.58,  // not null
        dateSubmitted: 9/16/1990, // not null
        dateResolved: 9/17/1990, // not null
        description: 'Replaced fence Triceratops tore through', // not null
        resolver: 1, // foreign key -> User
        status: 1, // foreign key -> ReimbursementStatus, not null
        type: 1 // foreign key -> ReimbursementType
    },
    {
        reimbursementId: 10, // primary key
            author: 10,  // foreign key -> User, not null
            amount: 44000.01,  // not null
        dateSubmitted: 10/29/1990, // not null
        dateResolved: 10/30/1990, // not null
        description: 'Hired new trainer - Alec was eaten by Allosaurus', // not null
        resolver: 1, // foreign key -> User
        status: 1, // foreign key -> ReimbursementStatus, not null
        type: 4 // foreign key -> ReimbursementType
    },
]

export let reimbursementStatus: ReimbursementStatus[] = [
    {
        statusId: 1,
        status: 'Pending'
    },
    {
        statusId: 2,
        status: 'Approved'
    },
    {
        statusId: 3,
        status: 'Denied'
    }
]

export let reimbursementType: ReimbursementType[] = [
    {
        typeId: 1,
        type: 'Maintenance'
    },
    {
        typeId: 2,
        type: 'Inventory'
    },
    {
        typeId: 3,
        type: 'Food'
    },
    {
        typeId: 4,
        type: 'Payroll'
    }
]
