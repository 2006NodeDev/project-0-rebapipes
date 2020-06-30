import { Reimbursement } from "../models/Reimbursement";
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { ReimbursementDTOtoReimbursementConverter } from "../util/ReimbursementDTO-to-Reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError"

// Get Reimbursements by User

export async function getReimbursementsByUser(id:number):Promise<Reimbursement[]>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select r.*, rs.status, rs."status_id", rt."type", rt."type_id" from jurassic_park_ers_api.reimbursement r
                                                        join jurassic_park_ers_api.reimbursement_status rs on r.status = rs.status_id
                                                        join jurassic_park_ers_api.reimbursement_type rt on r."type" = rt.type_id
                                                        where r."author" = $1
                                                        order by r.date_submitted;`, [id]);
        if (results.rowCount === 0){
            throw new Error('No Reimbursements Found');
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
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
