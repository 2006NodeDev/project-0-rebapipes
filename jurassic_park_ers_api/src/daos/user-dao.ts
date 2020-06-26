import { PoolClient } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-convertor";

export async function getAllUsers(){
    let client:PoolClient
    try{
        client = await connectionPool.connect() // update query below
        let results = await client.query(`select u.user_id, u.username , u."password" , u.email ,r.role_id , r."role" from jurassicpark.users u left join jurassicpark.roles r on u."role" = r.role_id;`)
        return results.rows.map(UserDTOtoUserConvertor)
    }catch(e){
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release()
    }
}
