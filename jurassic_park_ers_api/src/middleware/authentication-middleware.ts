import { Request, Response, NextFunction } from "express";
import { LoginInvalidCredentialsError } from "../errors/LoginInvalidCredentialsError";

export function authenticationMiddleware(req:Request, res:Response, next:NextFunction){
    if(!req.session.user) {
        throw new LoginInvalidCredentialsError()
    } else{
        console.log(`user ${req.session.user.username} has a role of ${req.session.user.role}`);
        next()
    }
}
