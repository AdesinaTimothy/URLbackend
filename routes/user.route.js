
import express from "express"
import {signUpPostRequestBodySchema , loginPostRequestBodySchema} from "../validation/request.validation.js"
import {hashedPasswordWithSalt} from "../utils/hash.js"
import { getUserByEmail } from "../services/user.service.js";
import { createUser } from "../services/user.service.js";
import {createUserToken} from "../utils/token.js"


const router = express.Router()

router.post("/signup", async (req, res) => {
    const validationResult = await signUpPostRequestBodySchema.safeParseAsync(req.body);


    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format()});
    }

    const { firstname, lastname, email, password} = validationResult.data;


    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return res.status(400).json({ error: `User with ${email} already exists`})
    }

   const {salt, hashedPassword} =  hashedPasswordWithSalt(password)


    const newUser = await createUser(email, firstname, lastname, hashedPassword, salt)

    return res.status(201).json({data : {userId: newUser.id }});

})

router.post("/login", async (req, res) => {
const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body)


if (validationResult.error) {
    return res.status(400).json({error : validationResult.error.format()})
}

const {  email, password} = validationResult.data;

const user = await getUserByEmail(email);

if (!user) {
    return res
    .status(404)
    .json({error: `User with email ${email} does not exists`})
}


const { hashedPassword} = hashedPasswordWithSalt(password, user.salt)

if (user.password !== hashedPassword) {
    return res.status(400).json({ error: "Invalid Password"})
}

const token = await createUserToken( {id: user.id})

res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, 
})

return res.status(200).json({ token , message: "Login Successfull with token" });


})

export default router;

// res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 60 * 60 * 1000, 
// })

// return res.status(200).json({message: "Login Sucessfull"})