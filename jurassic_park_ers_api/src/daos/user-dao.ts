  
import { PoolClient } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-converter";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { User } from "../models/User";
import { AuthFailureError} from '../errors/AuthFailureError'
import { UserUserInputError } from "../errors/UserUserInputError";

export async function getAllUsers():Promise<User[]> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u.user_id, u.username , u."password" , u.firstName, u.lastName, u.email , r.role_id , r."role" from jurassicpark.users u left join jurassicpark.roles r on u."role" = r.role_id;`)
        return results.rows.map(UserDTOtoUserConvertor)
    } catch (e) {
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

export async function getUserById(id: number):Promise<User> {
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u.user_id, 
                u.username , 
                u."password" , 
                u.firstName ,
                u.lastName ,
                u.email ,
                r.role_id , 
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

export async function getUserByUsernameAndPassword(username:string, password:string):Promise<User>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                u."username" , 
                u."password" , 
                u.firstName ,
                u.lastName ,
                u."email" ,
                r."role_id" , 
                r."role" 
                from jurassicpark.users u left join jurassicpark.roles r on u."role" = r.role_id 
                where u."username" = $1 and u."password" = $2;`,
            [username, password])

        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new AuthFailureError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

export async function saveOneUser(newUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let roleId = await client.query(`select r."role_id" from jurassicpark.roles r where r."role" = $1`, [newUser.role])
        if(roleId.rowCount === 0){
            throw new Error('Role Not Found')
        }
        roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into jurassicpark.users ("username", "password", "firstName", "lastName", "email","role")
                                            values($1,$2,$3,$4) returning "user_id" `,
                                            [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, roleId])
        newUser.userId = results.rows[0].user_id
        await client.query('COMMIT;')
        return newUser

    }catch(e){
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found'){
            throw new UserUserInputError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}
