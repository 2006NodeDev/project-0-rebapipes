import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../models/User";
import { UserDTOtoUserConverter } from "../utils/UserDTO-to-User-converter";
import { AuthenticationError } from '../errors/AuthenticationError';
import { UserNotFoundError } from "../errors/UserNotFoundError"
//import { AuthorizationError } from '../errors/AuthorizationError';
//import { UserNotFoundError } from "../errors/UserNotFoundError";
//import { LoginInvalidCredentialsError } from "../errors/LoginInvalidCredentialsError"

// Get all Users
export async function getAllUsers():Promise<User[]>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select u.user_id, u.username, u.password, u.first_name, u.last_name, u.email, r.role_id, r."role" 
                                                        from jurassic_park_ers_api.users u
                                                        join jurassic_park_ers_api.roles r on u."role" = r.role_id
                                                        group by u.user_id, u.username, u.first_name, u.last_name, u.email, r.role_id, r."role"
                                                        order by u.user_id;`);
        
        if (results.rowCount === 0){
            throw new Error('No Users Found');
        }
        return results.rows.map(UserDTOtoUserConverter);
        
    } catch (error) {
        if (error.message === "User Not Found"){
            console.log(error);
            throw new Error(error.message);
        }
        throw new Error('An Unknown Error Occurred');
    } finally {
        client && client.release();
    }
}

// Get User by Username & Password

export async function getUserByUserNameAndPassword(username:string, password:string):Promise<User>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results = await client.query(`select u.user_id, u.username, u.password, u.first_name, u.last_name, u.email, r.role_id, r."role" 
                                            from jurassic_park_ers_api.users u
                                            join jurassic_park_ers_api.roles r on u."role" = r.role_id
                                            where u."username" = $1 and u."password" = $2
                                            group by u.user_id, u.username, u.first_name, u.last_name, u.email, r.role_id, r."role"`,
                                            [username, password]); // paramaterized queries, pg auto sanitizes

        if (results.rowCount === 0){
            throw new Error('User Not Found');
        }
        return UserDTOtoUserConverter(results.rows[0]);
        
    } catch (error) {
        throw new AuthenticationError();
    } finally{
        client && client.release();
    }
}

// Get Users by Id

export async function getUsersById(id:number):Promise<User>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select u.user_id, u.username, u.password, u.first_name, u.last_name, u.email, r.role_id, r."role" 
        from jurassic_park_ers_api.users u
        join jurassic_park_ers_api.roles r on u."role" = r.role_id
        where u.user_id = $1`, [id]); // parameterized queries

        return UserDTOtoUserConverter(results.rows[0]);

    } catch (error) {
        if (error.message === "User Not Found"){
            console.log(error);
            throw new UserNotFoundError()
        }
        throw new Error('An Unknown Error Occurred');
    } finally {
        client && client.release();
    }
}

// Update User

export async function updateOneUser(updatedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()

        await client.query(`update jurassic_park_ers_api.users 
                                            set "username" = $1, "password" = $2, "first_name" = $3, "last_name" = $4, "email" = $5, "role" = $6
                                            where user_id = $7 returning "user_id" `,
                                            [updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.email, updatedUser.role.roleId, updatedUser.userId])
        return getUsersById(updatedUser.userId);

    }catch(e){
        console.log(e)
        throw new Error('An Unknown Error Occurred')
    }finally{
        client && client.release();
    }
}
