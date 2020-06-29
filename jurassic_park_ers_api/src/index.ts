import express, { Request, Response, NextFunction } from 'express'
import { userRouter } from './routers/user-router';
import { reimbursementRouter } from './routers/reimbursement-router'
import { LoginInvalidCredentialsError } from './errors/LoginInvalidCredentialsError'
import { getUserByUsernameAndPassword } from './daos/user-dao';
import { loggingMiddleware } from './middleware/logging-middleware'
import { sessionMiddleware } from './middleware/session-middleware'
//import { authorizationMiddleware } from './middleware/authorization-middleware'
//import { authenticationMiddleware } from './middleware/authentication-middleware'
//import { AuthenticationError } from './errors/AuthenticationError'
//import { AuthorizationError } from './errors/AuthorizationError'
//import { LoginUserInputError } from './errors/LoginUserInputError'
//import { UserNotFoundError } from './errors/UserNotFoundError'
//import { UserReimbursementInputError } from './errors/UserReimbursementInputError'

const app = express()

app.use(express.json())

app.use(loggingMiddleware)

app.use(sessionMiddleware)

//app.use(authorizationMiddleware)

//app.use(authenticationMiddleware)

app.use('/users', userRouter)

app.use('/reimbursements', reimbursementRouter)

app.post('/login', async (req:Request, res:Response, next:NextFunction)=>{
    // you could use destructuring, see ./routers/book-router
    let username = req.body.username
    let password = req.body.password
    // if I didn't get a usrname/password send an error and say give me both fields
    if(!username || !password){
        // make a custom http error and throw it or just send a res
        throw new LoginInvalidCredentialsError()
    } else {
        try{
            let user = await getUserByUsernameAndPassword(username, password)
            req.session.user = user// need to remeber to add their user data to the session
            // so we can use that data in other requests
            res.json(user)
        }catch(e){
            next(e)
        }
    }
})

app.use((err, req, res, next) =>{
    if (err.StatusCode){
        res.status(err.StatusCode).send(err.message)
    }else{
        console.log(err)
        res.status(500).send('Oops, Something Went Wrong')
    }
})

app.listen(3030, () => {
    console.log("Server Is Running");
})
