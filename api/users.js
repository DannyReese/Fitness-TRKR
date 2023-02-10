/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'secret_pass' } = process.env;
const {
    getUserByUsername,
    createUser
    } = require("../db");

router.use((req, res, next) => {
    next();
});

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userExists = getUserByUsername(username);

        if (userExists) {
            return next({
                name: 'UserExistsError',
                message: 'User already exists'
            });
        }

        if (password.length < 8) {
            return next({
                name: 'PasswordLengthError',
                message: 'Password is  not at least 8 characters'
            });
        }

        const newUser = await createUser({ username, password });

        if (!newUser) {
            return next({
                name: 'CreateUserError',
                message: 'Cannot create user'
            });
        }
        
        const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '1w' });

        res.send({ 
            user: newUser,
            message: 'Signed up',
            token
         })
    }
    catch (error) {
        next(error)
    }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
