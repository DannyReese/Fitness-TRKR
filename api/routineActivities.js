const express = require('express');
const { getRoutineActivityById, getRoutineById, updateRoutineActivity } = require('../db');
const routineActivitiesRouter = express.Router();

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', async (req, res, next) => {
    try {
        const { routineActivityId } = req.params;
        const { count, duration } = req.body;
        const routineActivity = await getRoutineActivityById(routineActivityId);
        const { routineId } = routineActivity;
        const routine = await getRoutineById(routineId);
        const updated = await updateRoutineActivity({ id: routineActivityId, count, duration });

        if (!req.user || req.user.id !== routine.creatorId) {
            res.send({
                error: 'CreatorError',
                message: 'Must be creator'
            });
            return;
        }

        res.send(updated);
    }
    catch (error) {
        next(error)
    }
});

// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
