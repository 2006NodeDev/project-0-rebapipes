import express, {Request, Response, NextFunction} from 'express'
import {User} from '../models/User'
import {authenticationMiddleware} from '../middleware/authentication-middleware'
import {authorizationMiddleware} from '../middleware/authorization-middleware'

export const userRouter = express.Router()

userRouter.use(authenticationMiddleware)

userRouter.get('/', authorizationMiddleware(['admin']), (req:Request,res:Response,next:NextFunction)=>{
    res.json(users)
})

// find user by ID
userRouter.get('/:id', authorizationMiddleware(['admin', 'finance-manager']), (req:Request, res:Response)=>{//figure out how to do basically userId===userId
    let {id} = req.params
    if(isNaN(+id)){
        res.status(400).send('ID must be a number')
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

// update user
userRouter.patch('/', authorizationMiddleware(['admin']), authenticationMiddleware, (req: Request, res:Response)=>{
    const user = users.find(val => val.userId === Number(req.params.id));
    user.username = req.body.name;
    return res.json({message: "Updated"})
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
                role: `admin`
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
            role: `finance-manager`
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
            role: `employee`
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
            roleId: 4,
            role: `employee`
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
            roleId: 5,
            role: `employee`
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
            roleId: 6,
            role: `employee`
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
            roleId: 7,
            role: `employee`
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
            roleId: 8,
            role: `employee`
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
            roleId: 9,
            role: `employee`
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
            roleId: 10,
            role: `employee`
        }  
    },
]
