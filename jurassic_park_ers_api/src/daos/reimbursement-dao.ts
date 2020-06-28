import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConverter } from "../utils/ReimbursementDTO-to-Reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";


import { User } from "../models/User";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-converter";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { LoginInvalidCredentialsError } from "../errors/LoginInvalidCredentialsError";

import { UserReimbursementInputError } from "../errors/UserReimbursementInputError";
import { AuthenticationError } from '../errors/AuthenticationError'
import { AuthorizationError } from '../errors/AuthorizationError'
import { LoginUserInputError } from "../errors/LoginUserInputError";

export async function getAllReimbursements() {
    let client: PoolClient; 
    try {
        client = await connectionPool.connect() // update query below
        let results: QueryResult = await client.query(`select b.book_id, b."pages", b.chapters, b."ISBN" ,b.series , b.number_in_series , b.publisher , b.publishing_date , b.title, array_agg(distinct (a.author)) as authors, array_agg(distinct (g.genre)) as genres 
                                                    from lightlyburning.books b 
                                                    natural join lightlyburning.books_authors ba 
                                                    natural join lightlyburning.authors a
                                                    natural join lightlyburning.books_genre bg
                                                    natural join lightlyburning.genre g
                                                    group by b.book_id;`)
        return results.rows.map(ReimbursementDTOtoReimbursementConverter)
    } catch (e) {
        console.log(e)
        throw new Error('un-implemented error handling')
    } finally {
        client && client.release()
    }
}

export async function findReimbursementById(id:number) {
    let client: PoolClient;
    try{
        client = await connectionPool.connect() // update query below
        let results: QueryResult = await client.query(`select b.book_id, b."pages", b.chapters, b."ISBN" ,b.series , b.number_in_series , b.publisher , b.publishing_date , b.title, array_agg(distinct (a.author)) as authors, array_agg(distinct (g.genre)) as genres 
        from lightlyburning.books b 
        natural join lightlyburning.books_authors ba 
        natural join lightlyburning.authors a
        natural join lightlyburning.books_genre bg
        natural join lightlyburning.genre g
        where b.book_id = ${id}
        group by b.book_id;`)

        if(results.rowCount === 0){
            throw new Error('NotFound')
        }else{
            return ReimbursementDTOtoReimbursementConvertor(results.rows[0])
        }
    }catch(e){
        if(e.message === 'NotFound'){
            throw new ReimbursementNotFoundError()
        }
        console.log(e)
        throw new Error('un-implemented error handling')
    }finally{
        client && client.release()
    }
}
