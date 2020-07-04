import { Role } from "./role"

export class User {
    userId: number //primary key
    username: string //not null, unique
    password: string //not null, unique
    firstName: string //not null
    lastName: string //not null
    email: string //not null
    role: Role //not null
}
