import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConvertor } from "../utils/ReimbursementDTO-to-Reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { ReimbursementIdInputError } from "../errors/ReimbursementIdInputError";
import { AuthorizationError } from '../errors/AuthorizationError'

// Find Reimbursement by Status
// export async function getReimbursementByStatus(id: number):Promise<Reimbursement> {

// Find Reimbursement by Type
// export async function getReimbursementByType(id: number):Promise<Reimbursement> {

// Find all Users
export async function getAllUsers(){
    // Declare a Client
    let client:PoolClient
    try{
        // Get a Connection
        client = await connectionPool.connect()
        // Send a Query
        let results: QueryResult = await client.query(`select u.user_id, u.username , u."password" , u.firstName, u.lastName u.email , r.role_id , r."role" from jurassicpark.users u left join jurassicpark.roles r on u."role" = r.role_id;`)
        return results.rows.map(UserDTOtoUserConvertor) // Return rows
    }catch(e){
        // in case we get an error we don't know 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        // release connection back to the pool
        client && client.release()
    }
}

// Get User by ID
export async function getUserById(id: number):Promise<User> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select u.user_id, 
                u.username, 
                u."password",
                u.firstName,
                u.lastName, 
                u.email,
                r.role_id, 
                r."role" 
                from jurassicpark.users u left join jurassicpark.roles r on u."role" = r.role_id 
                where u.user_id = $1;`,
            [id])
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        } 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}
