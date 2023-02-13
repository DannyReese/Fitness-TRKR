const express = require('express');
const { getPublicRoutinesByActivity } = require('../db');
const activitiesRouter = express.Router();

// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {

    try {
        const activityId = req.params;
        activityId.id = parseInt(activityId.activityId);
        const activities = await getPublicRoutinesByActivity(activityId);

        if (activities.length) {
            res.send(activities);
        } else {
            res.send({
                error: "error",
                message: `Activity ${req.params.id} not found`,
                name: 'name'
            });
        }

    }
    catch (error) {
        next(error)

    }

});

// GET /api/activities
activitiesRouter.get('/', async (req, res, next) => {
    try {
        const allActivities = await getAllActivities();

        res.send(allActivities);
    } catch (error) {
        next(error)
    }
});

// POST /api/activities
router.post('/', async (req, res, next) => {
    try {
        if (req.user) {
            const { name, description } = req.body;
            const activitieCheck = await getActivityByName(name);

            if (activitieCheck) {
                res.send({
                    error: "error activity already exists",
                    message: "An activity with name Push Ups already exists",
                    name: "ActivityExists"
                })
            } else {
                const activity = await createActivity({ name, description });

                res.send(activity);
            }
        }
    } catch (error) {
        next(error)
    }
});

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res,next) => {
    try{
    const fields = req.body;
    const id = req.params.activityId;
    const name = fields.name;
    const checkActivity = await getActivityById(id);
    const checkActivityName = await getActivityByName(name);
    const updatedActivity = {};
    
    if (checkActivity) {
        (checkActivityName) ?
            res.send({
                error: 'error',
                message: `An activity with name ${name} already exists`,
                name: 'NameTaken'
            })
            :
            updatedActivity.activity = await updateActivity({ id, name: fields.name, description: fields.description });
        res.send(updatedActivity.activity)

    } else {
        res.send({
            error: 'error',
            message: `Activity ${id} not found`,
            name: 'errorMessage'
        });
    }
    }catch(error){
        next(error)
    }
})


module.exports = activitiesRouter;
