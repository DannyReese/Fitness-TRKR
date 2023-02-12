const express = require('express');
const router = express.Router();
const { canEditRoutineActivity,
    updateRoutineActivity,
    destroyRoutineActivity
} = require('../db')

router.use((req, res, next) => {
    next()
});

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async (req, res, next) => {
    try {
        const routineActivityId = parseInt(req.params.routineActivityId);
        const userId = req.user.id;
        const canEdit = await canEditRoutineActivity(routineActivityId, userId);
        const fields = req.body;
        fields.id = routineActivityId;
        if (canEdit) {
            const editedRoutine = await updateRoutineActivity(fields);
            res.send(editedRoutine);
        } else {
            res.send({
                error: 'must own routine activity to be able to edit',
                message: `User ${req.user.username} is not allowed to update In the evening`,
                name: 'NotOwner'
            })
        }
    } catch (error) {
        next(error);
    }
});
// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {
    try {
        const routineActivityId = parseInt(req.params.routineActivityId);
        const userId = req.user.id;
        const canDelete = await canEditRoutineActivity(routineActivityId, userId);
        if (canDelete) {
            const deletedRoutine = await destroyRoutineActivity(routineActivityId);
            res.send(deletedRoutine);
        } else {
            res.status(403).send({
                error: 'must own routine activity to be able to edit',
                message: `User ${req.user.username} is not allowed to delete In the afternoon`,
                name: 'NotOwner'
            })
        }
    } catch (error) {
        next(error);
    }
})


module.exports = router;
