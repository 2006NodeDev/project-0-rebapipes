import session, { SessionOptions } from 'express-session'

const sessionConfig:SessionOptions = {
    secret: 'secret', // needs to be updated
    cookie:{
        secure:false
    },
    resave:false,
    saveUninitialized:false
}

export const sessionMiddleware = session(sessionConfig)
