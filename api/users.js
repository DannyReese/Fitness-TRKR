/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const {getUserByUsername,createUser,getUser} = require('../db')


router.use((req, res, next) => {
    console.log('A USER request is being made');

    next();
});
// POST /api/users/register
router.post('/register',async(req,res,next)=>{
    const {username,password} = req.body;
   
    try{
        const _user = await getUserByUsername(username);
        if(_user){
            res.send({
                name:'UserExistsError',
                message:`User ${username} is already taken.`,
                error:'error'
        });
        }
        if(password.length < 8){
            res.send({
                name:'PasswordTooShort',
                message:"Password Too Short!",
                error:'error'
            })
        }
        const user = await createUser({
            username,
            password,
            });
           
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({
            id:user.id,
            username,
        },process.env.JWT_SECRET,{
            expiresIn: '1w'
        });
      
        res.send({
            message:'Thank You For Signing Up!',
            token,
            user
        });
    }catch({name,message}){
      
        next([name,message]);
    }
})
// POST /api/users/login
router.post('/login',async(req,res,next)=>{
    const {username, password} = req.body
    console.log('password',password)
    if(!username || !password){
        res.send({
            name:'MissingUserOrPassword',
            message:'Must enter username and password',
            error:'error'
        })
    }
    try{
        console.log('hi')
        const user = await getUserByUsername(username);
        const hashedPassword = user.password
        const comparePasswords = await bcrypt.compare(password, hashedPassword);
        
        if(comparePasswords){
            const jwt = require('jsonwebtoken')
            const token = jwt.sign({id:user.id,username:user.username},process.env.JWT_SECRET)
            res.send({ message: "you're logged in!",token:token,user});

            
        }else{
            res.send({
                name:'incorrect',
                message:"incorrect user name or password"
            })
        }
    }catch(error){
        throw new Error('unable to log in')
    }
})
// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
