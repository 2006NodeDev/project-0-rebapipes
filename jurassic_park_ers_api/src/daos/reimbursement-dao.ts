import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConvertor } from "../utils/ReimbursementDTO-to-Reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { UserReimbursementInputError } from "../errors/UserReimbursementInputError";
import { ReimbursementIdInputError } from "../errors/ReimbursementIdInputError";
import { AuthorizationError } from '../errors/AuthorizationError'

// Find all Reimbursements
export async function getAllReimbursements(){
    // Declare a Client
    let client:PoolClient
    try{
        // Get a Connection
        client = await connectionPool.connect()
        // Send a Query
        let results: QueryResult = await client.query(`select r.reimbursement_id, r.author , r."amount" , r.dateSubmitted, r.dateResolved, r."description", r.resolver, r.status, r.status_id, r.type, r.type_id, r."status" from jurassicpark.reimbursements r left join jurassicpark.status s on r."status" = s.status_id, r.type_id, r."type" from jurassicpark.reimbursements r left join jurassicpark.type t on r."type" = t.type_id;`)
        return results.rows.map(ReimbursementDTOtoReimbursementConvertor) // Return rows
    }catch(e){
        // in case we get an error we don't know 
        console.log(e)
        throw new Error('Unable to Retrieve Reimbursements')
    }finally{
        // release connection back to the pool
        client && client.release()
    }
}

// Get Reimbursement by ID
export async function getReimbursementById(id: number):Promise<Reimbursement> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select r.reimbursement_id, 
                r.author, 
                r."amount",
                r.dateSubmitted,
                r.dateResolved, 
                r."description",
                r.resolver,
                r."status",
                s.status_id, 
                r."type",
                t.type_id,
                from jurassicpark.reimbursements r left join jurassicpark.reimbursements s on r."status" = s.status_id, jurassicpark.reimbursements r left join jurassicpark.reimbursements t on r."type" = t.type_id  
                where r.reimbursement_id = $1;`,
            [id])
        if(results.rowCount === 0){
            throw new ReimbursementIdInputError()
        }
        return ReimbursementDTOtoReimbursementConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'Reimbursement Not Found'){
            throw new ReimbursementNotFoundError()
        } 
        console.log(e)
        throw new Error('Unable to Retrieve Reimbursement')
    } finally {
        client && client.release()
    }
}

// Get Reimbursement by Status
export async function getReimbursementByStatus(id: number):Promise<Reimbursement> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select s.status_id, 
            r."status",
            from jurassicpark.reimbursements r left join jurassicpark.reimbursements s on r."status" = s.status_id
            where r.status_id = $1;`,
            [id])
        if(results.rowCount === 0){
            throw new UserReimbursementInputError()
        }
        return ReimbursementDTOtoReimbursementConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'Reimbursement Not Found'){
            throw new ReimbursementNotFoundError()
        } 
        console.log(e)
        throw new Error('Unable to Retrieve Reimbursement')
    } finally {
        client && client.release()
    }
}

// Get Reimbursement by User
export async function getReimbursementByUser(id: number):Promise<Reimbursement> {
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
            throw new UserReimbursementInputError()
        }
        return ReimbursementDTOtoReimbursementConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'Reimbursement Not Found'){
            throw new ReimbursementNotFoundError()
        } 
        console.log(e)
        throw new Error('Unable To Complete Your Request')
    } finally {
        client && client.release()
    }
}

// Submit Reimbursement(s)
export async function submitReimbursement(){
    // Declare a Client
    let client:PoolClient
    try{
        // Get a Connection
        client = await connectionPool.connect()
        // Send a Query
        let results: QueryResult = await client.query(`select r.reimbursement_id, r.author , r."amount" , r.dateSubmitted, r.dateResolved, r."description", r.resolver, r.status, r.status_id, r.type, r.type_id, r."status" from jurassicpark.reimbursements r left join jurassicpark.status s on r."status" = s.status_id, r.type_id, r."type" from jurassicpark.reimbursements r left join jurassicpark.type t on r."type" = t.type_id;`)
        return results.rows.map(ReimbursementDTOtoReimbursementConvertor) // Return rows
    }catch(e){
        // in case we get an error we don't know 
        console.log(e)
        throw new Error('Unable to Submit Reimbursement')
    }finally{
        // release connection back to the pool
        client && client.release()
    }
}

// Update Reimbursement(s)
export async function updateReimbursement(id: number):Promise<Reimbursement> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select r.reimbursement_id, 
            r.author, 
            r."amount",
            r.dateSubmitted,
            r.dateResolved, 
            r."description",
            r.resolver,
            r."status",
            s.status_id, 
            r."type",
            t.type_id,
            from jurassicpark.reimbursements r left join jurassicpark.reimbursements s on r."status" = s.status_id, jurassicpark.reimbursements r left join jurassicpark.reimbursements t on r."type" = t.type_id  
            where r.reimbursement_id = $1;`,
            [id])
        if(results.rowCount === 0){
            throw new ReimbursementNotFoundError()
        }
        return ReimbursementDTOtoReimbursementConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'The incoming token has expired'){
            throw new AuthorizationError() // Not Authorized To Update Reimbursement(s)
        } 
        console.log(e)
        throw new Error('Unable to Update Reimbursement')
    } finally {
        client && client.release()
    }
}
