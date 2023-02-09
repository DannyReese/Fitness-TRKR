/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { getAllRoutinesByUser, getUserByUsername, createUser, getPublicRoutinesByUser, getUserById, getUser } = require('../db')


router.use((req, res, next) => {
    // console.log('A USER request is being made');

    next();
});
// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const xuser = await getUserByUsername(username);
        if (xuser) {
            res.send({
                name: 'UserExistsError',
                message: `User ${username} is already taken.`,
                error: 'error'
            });
        }
        if (password.length < 8) {
            res.send({
                name: 'PasswordTooShort',
                message: "Password Too Short!",
                error: 'error'
            });
        }
        const user = await createUser({
            username,
            password,
        });

        const jwt = require('jsonwebtoken')
        const token = jwt.sign({
            id: user.id,
            username,
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: 'Thank You For Signing Up!',
            token,
            user
        });
    } catch ({ name, message }) {

        next([name, message]);
    }
})

// POST /api/users/login
router.post('/login', async (req, res) => {
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
        throw new Error('unable to log in');
    }
});
// GET /api/users/me
router.get('/me', async (req, res) => {
    try {
        const user = req.user
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
        throw new Error('invalid user');
    }
});
// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res) => {
    const user = req.user.username;
    const username = req.params.username;
    try {
        if (username === user) {
            const username = req.user.username;
            const routines = await getAllRoutinesByUser({ username });
            res.send(routines);

        } else {
            const routines = await getPublicRoutinesByUser({ username });
            res.send(routines);

        }
    } catch (error) {
        throw new Error('cannot get routines for this user');
    }
});

module.exports = router;
