import express, { Request, Response, NextFunction, response } from 'express';
import { authenticationMiddleware } from '../middleware/authentication-middleware';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getAllUsers, getUserById, updateOneUser } from '../daos/user-dao'

export const userRouter = express.Router();

userRouter.use(authenticationMiddleware); // Authenticate User

// Get all Users

userRouter.get('/', authorizationMiddleware(['admin']), async (req:Request, res:Response, next:NextFunction)=>{
    try {
        let allUsers = await getAllUsers();
        res.json(allUsers);
    } catch (error) {
        next(error);
    }
})

// Get User by Id

userRouter.get('/:id', authorizationMiddleware (['admin', 'finance-manager']), async (req:Request, res:Response, next:NextFunction)=>{
    let {id} = req.params;
    if(isNaN(+id)){
        res.status(400).send("Id must be a number");
    } else{
        try {
            let user = await getUserById(+id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
})

// Update User

userRouter.patch('/', authorizationMiddleware(['admin']), async (req:Request, res:Response, next:NextFunction)=>{
    let {userId} = req.body;
    if(!userId){
        throw response.status(404).send('User Not Found')
    }else if(isNaN(+userId)){
        res.status(400).send("Id must be a number");
    }else{
        try {
            let user = await getUserById(+userId);

            if(req.body.username){
                user.username = req.body.username;
            }
            if(req.body.password){
                user.password = req.body.password;
            }
            if(req.body.firstName){
                user.firstName = req.body.firstName;
            }
            if(req.body.lastName){
                user.lastName = req.body.lastName;
            }
            if(req.body.email){
                user.email = req.body.email;
            }
            if (req.body.role){
                user.role.roleId = req.body.role.roleId;
            }

            let updatedUser = await updateOneUser(user);
            res.json(updatedUser);

        } catch (error) {
            next(error);
        }
    }
})
