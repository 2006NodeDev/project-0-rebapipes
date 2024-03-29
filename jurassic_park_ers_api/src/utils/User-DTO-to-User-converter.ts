import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/user";

//UserDTO takes objects in DB format & converts it to User model object(s)
export function UserDTOtoUserConverter(udto: UserDTO): User {
    return {
        userId: udto.user_id,
        username: udto.username,
        password: udto.password,
        firstName: udto.first_name,
        lastName: udto.last_name,
        email: udto.email,
        role: {
            role: udto.role,
            roleId: udto.role_id
        }
    }
}
