import { Request, Response, NextFunction } from "express";

//Logs out request method, ip address making request, and path of request
export function loggingMiddleware(req:Request, res:Response, next:NextFunction) {
    console.log(`${req.method} Request from ${req.ip} to ${req.path}`);
    next()
}
