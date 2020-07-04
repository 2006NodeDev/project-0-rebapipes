import session, { SessionOptions } from 'express-session'

//Attaches a session object to the request where each unique connection to the server has a unique session
const sessionConfig:SessionOptions = {
    secret: 'secret',
    cookie:{
        secure: false
    },
    resave: false,
    saveUninitialized:false
}

export const sessionMiddleware = session(sessionConfig)
