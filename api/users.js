/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {getUserByUsername,createUser} = require('../db')
router.use((req, res, next) => {
    console.log('A USER request is being made');

    next();
});
// POST /api/users/register
router.post('/register',async(req,res,next)=>{
    const {username,password} = req.body;
    console.log(username)
    try{
        const _user = await getUserByUsername(username);
        if(_user){
            next({
                name:'UserExistsError',
                message:'This username already exists'
        });
        }
        const user = await createUser({
            username,
            password,
            });
            console.log(user)
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({
            id:user.id,
            username,
        },process.env.JWT_SECRET,{
            expiresIn: '1w'
        });
        console.log(token)
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

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
