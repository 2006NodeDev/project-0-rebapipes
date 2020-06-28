import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConvertor } from "../utils/ReimbursementDTO-to-Reimbursement-converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { ReimbursementIdInputError } from "../errors/ReimbursementIdInputError";
import { AuthenticationError } from '../errors/AuthenticationError'
import { AuthorizationError } from '../errors/AuthorizationError'

// Find Reimbursement by Status
// export async function getReimbursementByStatus(id: number):Promise<Reimbursement> {

// Find Reimbursement by Type
// export async function getReimbursementByType(id: number):Promise<Reimbursement> {

// Find Reimbursement by ID
export async function getReimbursementById(id: number):Promise<Reimbursement> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select r.reimbursement_id, 
                r.author, 
                r.amount,
                r.dateSubmitted,
                r.dateResolved, 
                r.description,
                r.resolver,
                s.status_id, 
                s."ReimbursementStatus"
                t.type_id, 
                t."ReimbursementType"
                from jurassicpark.reimbursements u left join jurassicpark.statuses r on u."status" = r.status_id 
                from jurassicpark.reimbursements u left join jurassicpark.types r on u."type" = r.type_id 
                where u.reimbursement_id = $1;`,
            [id])
        if(results.rowCount === 0){
            throw new Error('Reimbursement Not Found')
        }
        return ReimbursementDTOtoReimbursementConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'Reimbursement Not Found'){
            throw new ReimbursementNotFoundError()
        } 
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

// lightly burning model

export async function findbookById(id:number) {
    let client: PoolClient;
    try{
        //id = '1 or 1 = 1; drop table lightlyburning.books cascade; select * from lightlyburning.book '
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select b.book_id, b."pages", b.chapters, b."ISBN" ,b.series , b.number_in_series , b.publisher , b.publishing_date , b.title, array_agg(distinct (a.author)) as authors, array_agg(distinct (g.genre)) as genres 
        from lightlyburning.books b 
        natural join lightlyburning.books_authors ba 
        natural join lightlyburning.authors a
        natural join lightlyburning.books_genre bg
        natural join lightlyburning.genre g
        where b.book_id = ${id}
        group by b.book_id;`)//directly inputting user values is very dangerous
        //sql injction which is very bad, we will learn how to fix with a parameterized query
        if(results.rowCount === 0){
            throw new Error('NotFound')
        }else{
            return BookDTOtoBookConvertor(results.rows[0])
        }
    }catch(e){
        //some real error handling
        if(e.message === 'NotFound'){
            throw new BookNotFoundError()
        }
        console.log(e)
        throw new Error('un-implemented error handling')
    }finally{
        client && client.release()
    }
}

export async function getAllBooks() {
    let client: PoolClient;// this will be the "connection" we borrow from the pool but 
    //that process can take some time and can fail so we declare the var ahead of time
    try {
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select b.book_id, b."pages", b.chapters, b."ISBN" ,b.series , b.number_in_series , b.publisher , b.publishing_date , b.title, array_agg(distinct (a.author)) as authors, array_agg(distinct (g.genre)) as genres 
                                                    from lightlyburning.books b 
                                                    natural join lightlyburning.books_authors ba 
                                                    natural join lightlyburning.authors a
                                                    natural join lightlyburning.books_genre bg
                                                    natural join lightlyburning.genre g
                                                    group by b.book_id;`)
        return results.rows.map(BookDTOtoBookConvertor)
    } catch (e) {
        //we should do some sort of error processing in this catch statement
        console.log(e)
        throw new Error('un-implemented error handling')
    } finally {
        // we make sure client isn't undefined
        client && client.release()//then we release it
    }
}
