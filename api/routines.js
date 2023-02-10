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
routinesRouter.post("/", requireUser async (req, res, next) => {
    try {
        const { isPublic, name, goal } = req.body;
        const creatorId = req.user.id;
        const routine = await createRoutine({ creatorId, isPublic, name, goal });

        if (routine) {
            res.send(routine);
        }
        else {
            res.send(error);
        }
    }
    catch (error) {
        next(error)
    }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
