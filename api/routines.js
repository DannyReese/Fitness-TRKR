const express = require('express');
const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine } = require('../db');
const routinesRouter = express.Router();

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
});

// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId', async (req, res, next) => {
    try {
        const id = req.params.routineId;
        const { isPublic, name, goal } = req.body;
        const updatedRoutine = await updateRoutine({ id, isPublic, name, goal });

        if (!req.user) {
            next({
                name: 'MissingUserError',
                message: 'User is required'
            });
        }

        if (updatedRoutine) {
            res.send(updatedRoutine);
        }
        else {
            next(error)
        }
    }
    catch (error) {
        next(error)
    }
});

// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId', async (req, res, next) => {
    try {
        const { routineId } = req.params;
        const routine = await getRoutineById(routineId);
        const deleteRoutine = await destroyRoutine(routineId);

        if (!req.user) {
            next({
                name: 'MissingUserError',
                message: 'User is required to delete'
            });
        }
        else if (req.user.id !== routine.creatorId) {
            next({
                name: 'NotCreatorError',
                message: 'Only the creator can delete'
            });
        }
        else {
            res.send(deleteRoutine);
        }
    }
    catch (error) {
        next(error)
    }
});

// POST /api/routines/:routineId/activities

module.exports = router;
