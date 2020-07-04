import express, { Request, Response, NextFunction } from 'express'
import { UserInputError } from '../errors/UserInputError'
import { getAllUsers, saveOneUser, getUserById, updateOneUser } from '../daos/user-dao'
import { User } from '../models/user'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { authorizationMiddleware } from '../middleware/authorization-middleware'

export const userRouter = express.Router()
userRouter.use(authenticationMiddleware) 

//Find all Users 
userRouter.get('/', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => { 
    try {
        let allUsers = await getAllUsers()
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

//Create a User(s)
userRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let { username,
        password,
        firstName,
        lastName,
        email,
        role } = req.body
    if(username && password && firstName && lastName && email && role) {
        let newUser: User = {
            userId: 0,
            username,
            password,
            firstName,
            lastName,
            email,
            role
        }
        try {
            let savedUser = await saveOneUser(newUser)
            res.json(savedUser)
        } catch (e) {
            next(e)
        }
    }
    else {
        next(new UserInputError)
    }
})

//Find Users by Id
userRouter.get('/:id', authorizationMiddleware(['Admin', 'Finance Manager', 'Current']), async (req:Request, res:Response, next:NextFunction) => {
    let {id} = req.params
    if(isNaN(+id)) {
        res.status(400).send('Id must be a number')
    }
    else { 
        try {
            let userById = await getUserById(+id)
            res.json(userById)
        } catch (e) {
            next(e)
        }
    }
})

//Update User, we assume that Admin will have access to UserId for each user
userRouter.patch('/', authorizationMiddleware(['Admin']), async (req:Request, res:Response, next:NextFunction) => {
    let { userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role } = req.body
    if(!userId) { //update request must contain a userId
        res.status(400).send('Please enter a valid user Id')
    }
    else if(isNaN(+userId)) { //check if userId is valid
        res.status(400).send('Id must be a number')
    }
    else {
        let updatedOneUser:User = {
            userId,
            username,
            password,
            firstName,
            lastName,
            email,
            role
        }
        updatedOneUser.username = username || undefined
        updatedOneUser.password = password || undefined
        updatedOneUser.firstName = firstName || undefined
        updatedOneUser.lastName = lastName || undefined
        updatedOneUser.email = email || undefined
        updatedOneUser.role = role || undefined
        try {
            let result = await updateOneUser(updatedOneUser)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }
}) 
