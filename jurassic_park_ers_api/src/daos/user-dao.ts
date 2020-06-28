import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../models/User";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-converter";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { LoginInvalidCredentialsError } from "../errors/LoginInvalidCredentialsError";
import { AuthenticationError } from '../errors/AuthenticationError'
import { AuthorizationError } from '../errors/AuthorizationError'

// Write an export async function for 

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
        throw new Error('Unable to Retrieve Users')
    }finally{
        // release connection back to the pool
        client && client.release()
    }
}

// Get User(s) by ID
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
                u."role",
                r.role_id,
                from jurassicpark.users u left join jurassicpark.roles r on u."role" = r.role_id 
                where u.user_id = $1;`,
            [id])
        if(results.rowCount === 0){
            throw new UserNotFoundError()
        }
        return UserDTOtoUserConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        } 
        console.log(e)
        throw new Error('Unable to Retrieve User')
    } finally {
        client && client.release()
    }
}

// Update User(s)
export async function updateUser(){
    // Declare a Client
    let client:PoolClient
    try{
        // Get a Connection
        client = await connectionPool.connect()
        // Send a Query
        let results: QueryResult = await client.query(`select u.user_id, u.username , u."password" , u.firstName, u.lastName u.email , r.role_id , r."role" from jurassicpark.users u left join jurassicpark.roles r on u."role" = r.role_id;`)
        return results.rows.map(UserDTOtoUserConvertor) // Return rows
    }catch(e){
        // User === updateUser
        console.log(e)
        throw new AuthorizationError() // Not Authorized to Update User(s)
    }finally{
        // release connection back to the pool
        client && client.release()
    }
}

// Login --> Get User by Username & Password
export async function getUserByUsernameAndPassword(username:string, password:string):Promise<User>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        // send a query
        let results: QueryResult = await client.query(`select u.user_id, 
                u.username", 
                u."password" ,
                u.first_name ,
                u.last_name , 
                u.email ,
                r.role_id , 
                r."role" 
                from jurassicpark.users u left join jurassicpark.roles r on u."role" = r.role_id 
                where u."username" = $1 and u."password" = $2;`,
            [username, password])
        if(results.rowCount === 0){
            throw new UserNotFoundError()
        }
        return UserDTOtoUserConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new LoginInvalidCredentialsError()
        }
        // if fields are missing
        console.log(e)
        throw new AuthenticationError()
    } finally {
        // release the connectiopn back to the pool
        client && client.release()
    }
}
