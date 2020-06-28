import express, { Request, Response, NextFunction } from 'express'
import { User, Role } from '../models/User'
import {authenticationMiddleware} from '../middleware/authentication-middleware'
import {authorizationMiddleware} from '../middleware/authorization-middleware'
import { getAllUsers, getUserById } from '../daos/user-dao'

export const userRouter = express.Router()

// Get all Users
userRouter.get('/', (req:Request,res:Response,next:NextFunction)=>{
    res.json(users)
})

// Get Users by ID
userRouter.get('/:id', (req:Request, res:Response)=>{
    let {id} = req.params
    if(isNaN(+id)){
        
        res.status(400).send('Invalid Credentials')
    } else {
        let found = false
        for(const user of users){
            if(user.userId === +id){
                res.json(user)
                found = true
            }
        }
        if(!found){
            res.status(404).send('User Not Found')
        }
    }
})

// Update User
userRouter.patch('/', (req:Request, res:Response, next:NextFunction)=>{
    let id = req.body.userId;

    if(!id){
        throw res.status(404).send('User Not Found')
    }else if(isNaN(+id)){
        res.status(400).send("Invalid Credentials");
    }else {
        let found = false;
        for(const user of users){
            if(user.userId === +id){

                let username = req.body.username;
                let password = req.body.password;
                let firstName = req.body.firstName;
                let lastName = req.body.lastName;
                let email = req.body.email;
                let role = req.body.role;

                if(username){
                    user.username = username;
                }
                if(password){
                    user.password = password;
                }
                if(firstName){
                    user.firstName = firstName;
                }
                if(lastName){
                    user.lastName = lastName;
                }
                if(email){
                    user.email = email;
                }
                if (role){
                    user.role = role;
                }

                res.json(user);
                found = true;
            }
        }
        if(!found){
            res.status(404).send('User Not Found')
        }
    }
})

export let users:User[] =[
    {
        userId: 1,
            username: 'charles.darwin',
            password: 'naturalselection1', 
            firstName: 'Charles',
            lastName: 'Darwin',
            email: 'charles.darwin@jurassicpark.com',
            role: {
                roleId: 1,
                role: `Admin`
            }

    },
    {
        userId: 2,
        username: 'john.hammond',
        password: 'dinosrule4ever', 
        firstName: 'John',
        lastName: 'Hammond',
        email: 'john.hammond@jurassicpark.com',
        role: {
            roleId: 2,
            role: `Finance-Manager`
        }
    },
    {
        userId: 3,
        username: 'benjamin.lockwood',
        password: 'jurassicparka', 
        firstName: 'Benjamin',
        lastName: 'Lockwood',
        email: 'benjamin.lockwood@jurassicpark.com',
        role: {
            roleId: 3,
            role: `User`
        }  
    },
    {
        userId: 4,
        username: 'ellie.sattler',
        password: 'dinosaurluvr2', 
        firstName: 'Ellie',
        lastName: 'Sattler',
        email: 'ellie.sattler@jurassicpark.com',
        role: {
            roleId: 3,
            role: `User`
        }  
    },
    {
        userId: 5,
        username: 'lex.murphy',
        password: 'babysharkd00d00', 
        firstName: 'Lex',
        lastName: 'Murphy',
        email: 'lex.murphy@jurassicpark.com',
        role: {
            roleId: 3,
            role: `User`
        }  
    },
    {
        userId: 6,
        username: 'claire.dearing',
        password: 'Reptar91', 
        firstName: 'Claire',
        lastName: 'Dearing',
        email: 'claire.dearing@jurassicpark.com',
        role: {
            roleId: 3,
            role: `User`
        }  
    },
    {
        userId: 7,
        username: 'henry.wu',
        password: 'bigfootisreal', 
        firstName: 'Henry',
        lastName: 'Wu',
        email: 'henry.wu@jurassicpark.com',
        role: {
            roleId: 3,
            role: `User`
        }  
    },
    {
        userId: 8,
        username: 'arby.benton',
        password: 'IBELIEV3', 
        firstName: 'Arby',
        lastName: 'Benton',
        email: 'arby.benton@jurassicpark.com',
        role: {
            roleId: 3,
            role: `User`
        }  
    },
    {
        userId: 9,
        username: 'jack.thorne',
        password: 'RAPTOR5rock', 
        firstName: 'Jack',
        lastName: 'Thorne',
        email: 'jack.thorne@jurassicpark.com',
        role: {
            roleId: 3,
            role: `User`
        }  
    },
    {
        userId: 10,
        username: 'zia.rodriguez',
        password: 'megalodonlives!', 
        firstName: 'Zia',
        lastName: 'Rodriguez',
        email: 'zia.rodriguez@jurassicpark.com',
        role: {
            roleId: 3,
            role: `User`
        }  
    },
]

export let role:Role[] = [
    {
        roleId: 1,
        role: 'admin'
    },
    {
        roleId: 2,
        role: 'finance-manager'
    },
    {
        roleId: 3,
        role: 'employee'
    }
]
