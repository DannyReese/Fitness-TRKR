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

router.use((req,res,next) => {
  next();
});

// POST /api/users/register
router.post('/register', async (req,res,next) => {
  const { username, password, } = req.body;

  try{
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'User already exists Error',
        message: 'A user by that username already exists'
      });
    }
    const user = await createUser({
      username,
      password,

  });
  const token = jwt.sign({
    id:user.id,
    username
  }, process.env.JWT_SECRET, {
    expiresIn: '1w'
  });
    res.send({
      message:'Thank you for signing up!',
      token
    });
}   catch({name,message}) {
    next({name,message})
}
});


// POST /api/users/login
router.post('/login', async (req,res,next) => {
  const {username, password} = req.body;

  if(!username || !password) {
    next({
      name: 'Missing information Error',
      message:'Please add another username;'
    });
  }
  try{
    const user = await getUser(username);

    if (user && user.password == password) {

      const token = jwt.sign({id: user.id, username}, process.env.JWT_SECRET)

      res.send({message:'You are logged in!', token});

    } else{
      next({
        name:'Incorrect Credentials Error',
        message:'Username or password is incorrect'
      });
    }
  }   catch(error) {
      console.log(error);
      next(error);
  }
});


// GET /api/users/me

router.get(`/`, async (req,res,next) => {
  try{
    const user = req.user;
    if(user) {
      const {id} = req.user;
      const user = await getUserById(id);
      res.send(user);
    }
   if (!user) {
    res.status(401).send({
      error:'NotValidUser',
      message:'Must be logged in to perform this certain action',
      name:'Unathorized'
    });
   }
  } catch(error){
    next(error);
  }
  
  });


// GET /api/users/:username/routines
router.get(`/:username/routines`, async (req,res,next) => {
  try{
    const user = req.user;
    const username = req.params.username;
    if (username === user.username){
      
      const routines = await getAllRoutinesByUser(user);

      res.send(routines);

    } else{
      const routines = await getPublicRoutinesByUser({username});
      res.send(routines);
    }
  } catch(error) {
    next(error);
  }
});


module.exports = router;
