import { eq } from "drizzle-orm";
import db  from "../db/index.js"
import { usersTable } from "../models/user.model.js"

export async function getUserByEmail (email) {
    const [existingUser] = await db
    .select({
        id: usersTable.id,
        firstname: usersTable.firstname,
        lastname: usersTable.lastname,
        email: usersTable.email,
        salt: usersTable.salt,
        password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))

    // if(existingUser) {
    //     return res.status(400).json({ error: `User with email ${email} already exists!`});
    // }

    return existingUser;
}

export async function createUser (email, firstname, lastname, password, salt) {

    const [user] = await db.insert(usersTable).values({
        email,
        firstname,
        lastname,
        password, 
        salt: salt,
    }).returning({ id: usersTable.id})

    return user;
}
 
export async function createUrl () {
    
}