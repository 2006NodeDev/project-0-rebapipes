import { Pool } from 'pg'

export const connectionPool:Pool = new Pool({
    host: process.env['LB_HOST'], // public IP address of SQL instance
    user: process.env['LB_USER'], // user on your DB (probably postgres)
    password: process.env['LB_PASSWORD'], // password
    database: process.env['LB_DATABASE'], // name of DB
    port:5432, // DB's port
    max:5 //max # of connections
})
