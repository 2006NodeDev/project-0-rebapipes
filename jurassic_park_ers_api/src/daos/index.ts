import { Pool } from 'pg'

export const connectionPool:Pool = new Pool({
    host: process.env['jurassic_park_ers_api_HOST'],
    user: process.env['jurassic_park_ers_api_USER'],
    password: process.env['jurassic_park_ers_api_PASSWORD'],
    database: process.env['jurassic_park_ers_api_DATABASE'],
    port:5432,
    max:5
})
