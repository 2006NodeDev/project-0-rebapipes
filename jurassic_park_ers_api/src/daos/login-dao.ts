import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";

export async function loginWithUsernamePassword(username:String, password:String){
    let client:PoolClient;
    try{
        client = await connectionPool.connect()
        let result:QueryResult = await client.query(`select "userId", "username", "password", "firstName", "lastName", "email", r."role" from jurassic_park_ers_api."User" u left join jurassic_park_ers_api."Role" r on u."role"=r.roleId where u.username='${username}' and u."password"='${password}';`)
        return result.rows
    }catch(e){
        console.log(e)
        throw new Error('An Unknown Error Occurred')
    }finally{
        client && client.release()
    }
}