import { User } from "../models/User";
import { UserDTO } from "../dto/user-dto";
import { Role } from "../models/Role";

export function UserDTOtoUserConverter( udto:UserDTO ):User{
    let role:Role = ({roleId:udto.role_id, role:udto.role});
    return {
        userId: udto.user_id,
        username: udto.username, 
        password: udto.password,
        firstName: udto.first_name,
        lastName: udto.last_name, 
        email: udto.email, 
        role
    }
}
