import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../models/user";
import { UserDTOtoUserConverter } from "../utils/User-DTO-to-User-converter";
import { UserNotFoundError } from "../errors/UserNotFoundError"
import { UserInputError } from "../errors/UserInputError";
import { AuthenticationError } from '../errors/AuthenticationError';
//import { AuthorizationError } from '../errors/AuthorizationError';
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

// Get by Username & Password

export async function getByUsernameAndPassword(username:string, password:string):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                                            u."username", 
                                            u."password", 
                                            u."first_name", 
                                            u."last_name", 
                                            u."email", 
                                            r."role_id", 
                                            r."role" from jurassic_park_ers_api.users u
                                        left join jurassic_park_ers_api.roles r 
                                        on u."role" = r."role_id"
                                        where u."username" = $1 
                                            and u."password" = $2;`,
                                        [username, password])
        if(results.rowCount === 0) {
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConverter(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found') {
            throw new AuthenticationError()
        }
        console.log(e);
        throw new Error('An Unkown Error Occurred')
    } finally {
        client && client.release()
    }
}

// Get Users by Id

export async function getUserById(id:number):Promise<User>{
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

export async function updateUser(updatedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()

        await client.query(`update jurassic_park_ers_api.users 
                                            set "username" = $1, "password" = $2, "first_name" = $3, "last_name" = $4, "email" = $5, "role" = $6
                                            where user_id = $7 returning "user_id" `,
                                            [updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.email, updatedUser.role.roleId, updatedUser.userId])
        return getUserById(updatedUser.userId);

    }catch(e){
        console.log(e)
        throw new Error('An Unknown Error Occurred')
    }finally{
        client && client.release();
    }
}

// Save (Create) User

export async function saveOneUser(newUser:User):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let roleId = await client.query(`select r."role_id" 
                                        from jurassic_park_ers_api.roles r 
                                        where r."role" = $1`,
                                        [newUser.role])
        if(roleId.rowCount === 0) {
            throw new Error('Role Not Found')
        }
        roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into jurassic_park_ers_api.users 
                                        ("username", "password", 
                                            "first_name", "last_name", 
                                            "email", "role")
                                        values($1,$2,$3,$4,$5,$6) 
                                        returning "user_id"`,
                                        [newUser.username, newUser.password, 
                                            newUser.firstName, newUser.lastName, 
                                            newUser.email, roleId])
        newUser.userId = results.rows[0].user_id
        await client.query('COMMIT;')
        return newUser
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found') {
            throw new UserInputError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}
