import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConverter } from "../utils/Reimbursement-DTO-to-Reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { ReimbursementInputError } from "../errors/ReimbursementInputError";
//import { UserInputError } from "../errors/UserInputError";
//import { AuthorizationError } from '../errors/AuthorizationError'

// Get all Reimbursements

export async function getAllReimbursements():Promise<Reimbursement[]>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select r.*, rs.status, rs."status_id", rt."type", rt."type_id" from jurassic_park_ers_api.reimbursement r
                                                        join jurassic_park_ers_api.reimbursement_status rs on r.status = rs.status_id
                                                        join jurassic_park_ers_api.reimbursement_type rt on r."type" = rt.type_id
                                                        order by r.date_submitted;`);       
        if (results.rowCount === 0){
            throw new Error('No Reimbursements Found');
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (error) {
        if (error.message === "Reimbursements Not Found"){
            console.log(error);
            throw new ReimbursementNotFoundError()
        }
        throw new Error('An Unknown Error Occurred');
    } finally {
        client && client.release();
    }
}

// Get Reimbursement by user Id

export async function getReimbursementByUserId(userId:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description", r."resolver",
                                                rs."status_id", rs."status",
                                                rt."type_id", rt."type"
                                            from jurassic_park_ers_api.reimbursements r 
                                            left join jurassic_park_ers_api.reimbursement_statuses rs
                                                on r."status" = rs."status_id" 
                                            left join jurassic_park_ers_api.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                            left join jurassic_park_ers_api.users u 
                                                on r."author" = u."user_id"
                                                    where u."user_id" = $1
                                            order by r.date_submitted;`, [userId])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (e) {
        if(e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}

// Get Reimbursement By Status
export async function getReimbursementByStatus(status:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", 
                                                r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description",
                                                r."resolver",
                                                rs."status_id", 
                                                rs."status",
                                                rt."type_id",
                                                rt."type"
                                                    from jurassic_park_ers_api.reimbursements r 
                                            left join jurassic_park_ers_api.reimbursement_statuses rs
                                                on r."status" = rs."status_id" 
                                            left join jurassic_park_ers_api.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                                    where r."status" = $1
                                            order by r.date_submitted;`, [status])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (e) {
        if(e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}

// Save (Create) Reimbursement
export async function saveOneReimbursement(newReimbursement:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let typeId = await client.query(`select t."type_id" from jurassic_park_ers_api.reimbursement_types t 
                                            where t."type" = $1;`,
                                        [newReimbursement.type])
        if(typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].type_id 
        let statusId = await client.query(`select rs."status_id" from jurassic_park_ers_api.reimbursement_statuses rs 
                                            where rs."status" = $1;`, [newReimbursement.status])
        if(statusId.rowCount === 0) {
            throw new Error('Status Not Found')
        }
        statusId = statusId.rows[0].status_id
        let results = await client.query(`insert into jurassic_park_ers_api.reimbursements ("author", "amount", 
                                        "date_submitted", "description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) 
                                        returning "reimbursement_id";`,
                                        [newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted,
                                            newReimbursement.description, statusId, typeId]) 
        newReimbursement.reimbursementId = results.rows[0].reimbursement_id
        
        await client.query('COMMIT;')
        return newReimbursement
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Type Not Found' || e.message === 'Status Not Found') {
            throw new ReimbursementInputError()
        } 
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}

// Update Reimbursement
export async function updateReimbursement(updatedReimbursement:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedReimbursement.author) {
            await client.query(`update jurassic_park_ers_api.reimbursements set "author" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.author, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.amount) {
            await client.query(`update jurassic_park_ers_api.reimbursements set "amount" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.amount, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.dateSubmitted) {
            await client.query(`update jurassic_park_ers_api.reimbursements set "date_submitted" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.dateSubmitted, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.dateResolved) {
            await client.query(`update jurassic_park_ers_api.reimbursements set "date_resolved" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.dateResolved, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.description) {
            await client.query(`update jurassic_park_ers_api.reimbursements set "description" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.description, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.resolver) {
            await client.query(`update jurassic_park_ers_api.reimbursements set "resolver" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.resolver, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.status) {
            let statusId = await client.query(`select rs."status_id" from jurassic_park_ers_api.reimbursement_statuses rs 
                                            where rs."status" = $1;`, [updatedReimbursement.status])
            if(statusId.rowCount === 0) {
                throw new Error('Status Not Found')
            }
            statusId = statusId.rows[0].status_id
            await client.query(`update jurassic_park_ers_api.reimbursements set "status" = $1 
                                where "reimbursement_id" = $2;`, 
                                [statusId, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.type) {
            let typeId = await client.query(`select rt."type_id" from jurassic_park_ers_api.reimbursement_types rt 
                                            where rt."type" = $1;`, [updatedReimbursement.type])
            if(typeId.rowCount === 0) {
                throw new Error('Type Not Found')
            }
            typeId = typeId.rows[0].type_id
            await client.query(`update jurassic_park_ers_api.reimbursements set "type" = $1 
                                where "reimbursement_id" = $2;`, 
                                [typeId, updatedReimbursement.reimbursementId])
        }

        await client.query('COMMIT;')
        return updatedReimbursement
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Status Not Found' || e.message == 'Type Not Found') {
            throw new ReimbursementInputError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}
