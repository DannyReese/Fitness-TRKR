const express = require('express');
const { getAllPublicRoutines } = require('../db');
const router = express.Router();

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

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
