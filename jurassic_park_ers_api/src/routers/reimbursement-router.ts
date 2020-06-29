import express, { Request, Response, NextFunction } from 'express'
imbursement";
import { ReimbursementIdInputError } from '../errors/ReimbursementIdInputError'
from '../daos/reimbursement-dao'

import { reimbursementStatusRouter } from './reimbursementStatus-router';
import { reimbursementAuthorRouter } from './reimbursementAuthor-router';
import { Reimbursement, ReimbursementStatus, ReimbursementType } from "../models/Reimbursement
import { UserReimbursementInputError } from '../errors/UserReimbursementInputError'
import { getReimbursementById, getReimbursementByStatus, getReimbursementByType } 
import { ReimbursementNotFoundError } from '../errors/ReimbursementNotFoundError';

export const reimbursementRouter = express.Router()

// Reimbursement by Status
reimbursementRouter.use('/status', reimbursementStatusRouter);

// Reimbursement by Author (User)
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
        res.status(400).send("Reimbursement ID must be a number");
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
            res.status(404).send('Reimbursement Not Found')
        }
    }
})
