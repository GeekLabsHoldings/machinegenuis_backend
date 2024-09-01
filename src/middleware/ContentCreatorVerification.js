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
        req.currentUser = currentUser
        // console.log("Decoded Token :- " + JSON.stringify(currentUser))
        next();
    }
    catch(err)
    {
        console.log(err);        
        res.status(401).json({ message: "Invalid Token" })
    }    
}

const decodeToken = (req , res)  =>
{
    const authHeader = req.header('Authorization') || req.header('authorization')
    if (!authHeader)
    {
        res.status(401).json({ message : "Token is req."})
        return null
    }

    const token = authHeader.split(' ')[1]    
    try
    {
        const currentUser = jwt.verify(token , secretKey)
        console.log(currentUser);
        req.currentUser = currentUser
        return (JSON.stringify(currentUser))
    }
    catch(err)
    {
        console.log(err);        
        res.status(401).json({ message: "Invalid Token" })
        return null
    }    
} 

export { 
    verifyToken,
    decodeToken
 };