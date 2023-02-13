/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {
  getAllRoutinesByUser,
  getUserByUsername,
  createUser,
  getPublicRoutinesByUser,
  getUserById,
  getUser
} = require('../db')
const jwt = require('jsonwebtoken')

// POST /api/users/register
usersRouter.post('/login', async (req,res,next) => {
  const {username, password} = req.body;

  if(!username || !password) {
    next({
      name: "Missing information Error",
      message:"Please add another username"
    });
  }
  try{
    const user = await getUserByUsername(username);

    if (user && user.password == password) {

      const token = jwt.sign({id: user.id, username}, process.env.JWT_SECRET)

      res.send({message:"You're logged in!", token});

    } else{
      next({
        name:"Incorrect Credentials Error",
        message:"Username or password is incorrect"
      });
    }
  }   catch(error) {
      console.log(error);
      next(error);
  }
});

// POST /api/users/login





// GET /api/users/me





// GET /api/users/:username/routines





module.exports = router;
