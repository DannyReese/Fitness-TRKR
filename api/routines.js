const express = require('express');
const { getAllPublicRoutines, createRoutine } = require('../db');
const routinesRouter = express.Router();
const { requireUser } = require('./utils');

routinesRouter.use((req, res, next) => {
    next();
});

// GET /api/routines
routinesRouter.get("/", async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();

        if (routines) {
            res.send(routines);
        }
        else {
            next(error);
        }
    }
    catch (error) {
        next(error)
    }
});

// POST /api/routines
routinesRouter.post('/', async (req, res) => {
    try {
        const user = req.user
        if (user) {
            const fields = req.body;
            fields.creatorId = user.id;
            const newRoutine = await createRoutine(fields);
            res.send(newRoutine);
        } else {
            res.send({
                error: 'must be logged in',
                message: "You must be logged in to perform this action",
                name: "NotLoggedIn"
            });
        }
    } catch (error) {
        throw new Error('Cannot create routine')
    }
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
