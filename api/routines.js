
const express = require('express');
const router = express.Router();
const { getAllPublicRoutines,
    createRoutine,
    getRoutineById,
    updateRoutine,
    destroyRoutine,
    addActivityToRoutine
} = require('../db');

// GET /api/routines

router.get("/", async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();
        if (routines) {
            res.send(routines);
        }
    }
    catch (error) {
        next(error);
    }
});

// POST /api/routines
router.post('/', async (req, res, next) => {
    try {
        const user = req.user;
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
        next(error);
    }
})

// PATCH /api/routines/:routineId
router.patch('/:routineId', async (req, res, next) => {
    try {
        const user = req.user;

        if (user) {
            const fields = req.body;

            const id = parseInt(req.params.routineId);

            const authorization = await getRoutineById(id);

            if (authorization[0].creatorId === user.id) {
                fields.id = id;
                const updatedRoutine = await updateRoutine(fields);

                res.send(updatedRoutine);
            } else {
                res.status(403).send({
                    error: "error",
                    message: `User ${user.username} is not allowed to update Every day`,
                    name: 'NotOwner'
                });
            }

        } else {
            res.send({
                error: "error",
                message: "You must be logged in to perform this action",
                name: 'NotLoggedIn'
            });
        }
    } catch (error) { 
        next(error);
    }
})

// DELETE /api/routines/:routineId
router.delete('/:routineId', async (req, res, next) => {
    try {
        const user = req.user;
        const id = parseInt(req.params.routineId);
        const routine = await getRoutineById(id);
        const routineCopy = {
            ...routine[0]
        };
        if (routine[0].creatorId === user.id) {
            await destroyRoutine(id);
            res.send(routineCopy);
        } else {
            res.status(403).send({
                error: 'error',
                message: `User ${user.username} is not allowed to delete On even days`,
                name: 'NoTOwner'
            });
        }
    } catch (error) {
        next(error);
    }
})
// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', async (req, res, next) => {
    try {

        const routineId = parseInt(req.params.routineId);
        const activity = req.body;
        const activityId = activity.activityId;

        const routine = await getRoutineById(routineId);

        const arr = routine[0].activities.filter(a => a.id === activityId);

        if (!arr.length) {
            const returnVal = await addActivityToRoutine(activity);
            res.send(returnVal);
        } else {
            res.send({
                error: 'error',
                message: `Activity ID ${activity.activityId} already exists in Routine ID ${activity.routineId}`,
                name: 'already'

            });
        }

    } catch (error) {
        next(error);
    }
})




module.exports = router;
