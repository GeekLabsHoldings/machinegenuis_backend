import { log } from 'console';

const jwt = require('jsonwebtoken');
require('dotenv').config()
const secretKey = process.env.JWT_SECRET;

// Middleware to verify a JWT token
const verifyToken = (req , res , next) =>
{
    const authHeader = req.header('Authorization') || req.header('authorization')
    if (!authHeader)
    {
        return res.status(401).json({ message : "Token is req."})
    }

    const token = authHeader.split(' ')[1]    
    try
    {
        const currentUser = jwt.verify(token , secretKey)
        req.body.currentUser = currentUser
        // console.log("Decoded Token :- " + JSON.stringify(currentUser))
        next();
    }
    catch(err)
    {
        console.log(err);        
        res.status(401).json({ message: "Invalid Token" })
    }    
}

export { 
    verifyToken,
 };