/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
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
usersRouter.post('/register', async (req, res, next) => {
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
usersRouter.post('/login', async (req, res,next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.send({
            name: 'MissingUserOrPassword',
            message: 'Must enter username and password',
            error: 'error'
        });
    }
    try {

        const user = await getUser({ username, password });

        if (user) {
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
            res.send({ message: "you're logged in!", token, user });

        } else {
            res.send({
                name: 'incorrect',
                message: "incorrect user name or password"
            });
        }

    } catch (error) {
      next(error)
    }
});

// GET /api/users/me
usersRouter.get('/me', async (req, res, next) => {
    try {
        const user = req.user;

        if (user) {
            const { id } = req.user;
            const user = await getUserById(id);
            res.send(user);
        }
        if (!user) {
            res.status(401).send({
                error: "NotValidUser",
                message: "You must be logged in to perform this action",
                name: "Unauthorized"
            });
        }

    } catch (error) {
       next(error)
    }
});

// GET /api/users/:username/routines
usersRouter.get('/:username/routines', async (req, res,next) => {
    
    try {
    const user = req.user;
    const username = req.params.username;
        if (username === user.username) {
            const routines = await getAllRoutinesByUser(user);
            res.send(routines);
        } else {
            const routines = await getPublicRoutinesByUser({username});
            res.send(routines);

        }
    } catch (error) {
        next(error)
    }
});

module.exports = usersRouter;
