import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConverter } from "../utils/ReimbursementDTO-to-Reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
//import { UserInputError } from "../errors/UserInputError";
//import { ReimbursementIdInputError } from "../errors/ReimbursementIdInputError";
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

// Get Reimbursements by Id

export async function getReimbursementsById(id:number):Promise<Reimbursement>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select r.*, rs.status, rs."status_id", rt."type", rt."type_id" from jurassic_park_ers_api.reimbursement r
                                                        join jurassic_park_ers_api.reimbursement_status rs on r.status = rs.status_id
                                                        join jurassic_park_ers_api.reimbursement_type rt on r."type" = rt.type_id
                                                        where r.reimbursement_id = $1;`, [id]);
        return ReimbursementDTOtoReimbursementConverter(results.rows[0]);
    } catch (error) {
        if (error.message === "Reimbursement Not Found"){
            console.log(error);
            throw new ReimbursementNotFoundError()
        }
        throw new Error('An Unknown Error Occurred');
    } finally {
        client && client.release();
    }
}

// Save Reimbursement
export async function saveOneReimbursement(newReimbursement:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query(`insert into jurassic_park_ers_api.reimbursement ("author",
                                            "amount","date_submitted","description","status","type")
                                            values($1,$2,$3,$4,$5,$6) returning "reimbursement_id" `,
                                            [newReimbursement.author, newReimbursement.amount, newReimbursement.dateSubmitted, 
                                            newReimbursement.description, 1, newReimbursement.type.typeId]);
        newReimbursement.reimbursementId = results.rows[0].reimbursement_id
        console.log("New Id: ", newReimbursement.reimbursementId)
        return newReimbursement
    }catch(e){
        console.log(e)
        throw new Error('An Unknown Error Occurred')
    }finally{
        client && client.release();
    }
}

// Update Reimbursement
export async function updateOneReimbursement(updatedReimbursement:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        await client.query(`update jurassic_park_ers_api.reimbursement as r
                                set "author"=$1, "amount"=$2, "date_submitted"=$3, "date_resolved"=$4, "description"=$5, 
                                "resolver"=$6, "status"=$7, "type"=$8
                                where r."reimbursement_id"=$9 returning "reimbursement_id"`,
                                [updatedReimbursement.author, updatedReimbursement.amount, updatedReimbursement.dateSubmitted,
                                updatedReimbursement.dateResolved, updatedReimbursement.description, updatedReimbursement.resolver,
                                updatedReimbursement.status.statusId, updatedReimbursement.type.typeId, updatedReimbursement.reimbursementId]);
        
        return getReimbursementsById(updatedReimbursement.reimbursementId);
    }catch(e){
        console.log(e)
        throw new Error('Cannot Process Update')
    }finally{
        client && client.release();
    }
}
