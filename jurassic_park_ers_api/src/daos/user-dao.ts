import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../models/User";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-converter";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { LoginInvalidCredentialsError } from "../errors/LoginInvalidCredentialsError";
import { AuthenticationError } from '../errors/AuthenticationError'
import { AuthorizationError } from '../errors/AuthorizationError'

// Write an export async function for update Users

// Find all Users
export async function getAllUsers(){
    // Declare a Client
    let client:PoolClient
    try{
        // Get a Connection
        client = await connectionPool.connect()
        // Send a Query
        let results: QueryResult = await client.query(`select u.user_id, u.username , u."password" , u.firstName, u.lastName u.email , r.role_id , r."role" from jurassic_park_ers_api.users u left join jurassic_park_ers_api.roles r on u."role" = r.role_id;`)
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
                from jurassic_park_ers_api.users u left join jurassic_park_ers_api.roles r on u."role" = r.role_id 
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
        let results: QueryResult = await client.query(`select u.user_id, u.username , u."password" , u.firstName, u.lastName u.email , r.role_id , r."role" from jurassic_park_ers_api.users u left join jurassic_park_ers_api.roles r on u."role" = r.role_id;`)
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
                from jurassic_park_ers_api.users u left join jurassic_park_ers_api.roles r on u."role" = r.role_id 
                where u."username" = $1 and u."password" = $2;`,
            [username, password])
        if(results.rowCount === 0){
            throw new UserNotFoundError()
        }
        return UserDTOtoUserConvertor(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new AuthenticationError()
        }
        // if fields are missing
        console.log(e)
        throw new LoginInvalidCredentialsError()
    } finally {
        // release the connection back to the pool
        client && client.release()
    }
}

// Save User(s)
export async function saveOneUser(newUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let roleId = await client.query(`select r."role_id" from jurassic_park_ers_api.roles r where r."role" = $1`, [newUser.role])
        if(roleId.rowCount === 0){
            throw new Error('Role Not Found')
        }
        roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into jurassic_park_ers_api.users ("username", "password","email", "firstName, "lastName", role")
                                            values($1,$2,$3,$4) returning "user_id" `,
                                            [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, roleId])
        newUser.userId = results.rows[0].user_id
        await client.query('COMMIT;')
        return newUser

    }catch(e){
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found'){
            throw new UserNotFoundError()
        }
        console.log(e)
        throw new Error('Unable to Create or Save User')
    }finally{
        client && client.release();
    }
}
