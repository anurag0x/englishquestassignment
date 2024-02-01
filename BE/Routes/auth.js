const express = require('express')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { User } = require("../Models/user.model")
require("dotenv").config()

const authRouter = express.Router()


authRouter.post('/register', async (req, res)=>{
    const {phone, email, password, name, role} = req.body
    try {
        if(!phone || !email || !password || !name) return res.status(400).send({message : "Please provide all the required fields phone, email, password and name", isOk: false})

        let user;
        user = await User.findOne({email : email})
        if(user) return res.status(400).send({message : "User already exists with the given email", isOk : false})

        user = await User.findOne({phone : phone})
        if(user) return res.status(400).send({message : "User already exists with the given phone", isOk : false})

        const hashedPass = await bcrypt.hash(password, +process.env.SALT_ROUND)

        user = await User.create({...req.body, password : hashedPass})
        
        if (!user) return res.status(500).send({message : "Unable to save user details", isOk : false})

        const token =  jwt.sign({id : user._id, name : user.name, role : user.role}, process.env.SECRET_KEY, {expiresIn : "7d"})

        return res.status(200).send({message : "User registered successfuly.", user, token, isOk : true})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message : "Internal Server Error", error: error.message, isOk: false })
    }
})


authRouter.post('/login', async (req, res)=>{
    const {phone, email, password} = req.body
    try {
        if((!phone && !email) || !password) return res.status(400).send({message : "Please provide all the required fields phone or email and password", isOk: false})

        let query = {};

        if(email) query.email = email
        if(phone) query.phone = phone

        const user = await User.findOne(query)
        if(!user) return res.status(404).send({message : "User not Found!"})
        
        const isPassCorrect = await bcrypt.compare(password, user.password)
        if(!isPassCorrect) return res.status(400).send({message : "Wrong Credientials !", isOk : false})

        const token =  jwt.sign({id : user._id, name : user.name, role : user.role}, process.env.SECRET_KEY, {expiresIn : "7d"})

        return res.status(200).send({message : "Login successful", user, token, isOk : true})
    } catch (error) {
        return res.status(500).send({message : "Internal Server Error", error: error.message, isOk: false })
    }
})


authRouter.get('/verify', async (req, res)=>{
    try {
        let token = req.header("Authorization");
        if (!token || !token.startsWith("Bearer"))
        return res
            .status(401)
            .send({ message: "Please provide the token.", isOk: false });

        token = token.split(" ")[1];
        if (!token) return res.status(401).send({message : "token required!", isOk : false});

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) return res.status(403).send({message : "Token expired!", isOk : false});
            return res.status(200).send({message: "token is valid.", isOk : true})
        })
    } catch (error) {
        return res.status(500).send({message : "Internal Server Error", error: error.message, isOk: false })
    }
})


module.exports = {authRouter}