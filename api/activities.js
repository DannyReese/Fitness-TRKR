const express = require('express');
const { getAllActivities, getPublicRoutinesByActivity, createActivity, getActivityByName, updateActivity, getActivityById } = require('../db');
const router = express.Router()
// const activitiesRouter = router

router.use((req, res, next) => {
    // console.log('sending something from activities')
    next()
})
// GET /api/activities/:activityId/routines

// GET /api/activities
router.get('/', async (req, res, next) => {
    try {
        const allActivities = await getAllActivities()

        res.send(allActivities)
    } catch (error) {
        next(error)
    }
})

router.get('/:activityId/routines', async (req, res) => {

    try {
        const activityId = req.params

        activityId.id = parseInt(activityId.activityId)
      
        const activities = await getPublicRoutinesByActivity(activityId);
  
        if (activities.length) {
            res.send(activities)
        } else {
            res.send({
                error: "error",
                message: `Activity ${req.params.id} not found`,
                name: 'name'
            })
        }

    }
    catch (error) {
        throw new Error('cant get public routines that include this activity')
    }

})


// POST /api/activities
router.post('/', async (req, res) => {

    if (req.user) {

        const { name, description } = req.body

        const activitieCheck = await getActivityByName(name)

        if (activitieCheck) {
            res.send({
                error: "error activity already exists",
                message: "An activity with name Push Ups already exists",
                name: "ActivityExists"
            })
        } else {
            const activity = await createActivity({ name, description })

            res.send(activity)
        }
    }

})
// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res) => {


    const fields = req.body
    const name = fields.name
    const id = req.params.activityId
    const checkActivity = await getActivityById(id)
    const checkActivityName = await getActivityByName(name)
    const updatedActivity = {}
   

    if (checkActivity) {
        (checkActivityName) ?
            res.send({
                error: 'error',
                message: `An activity with name ${name} already exists`,
                name: 'NameTaken'
            })
            :
            updatedActivity.activity = await updateActivity({ id, name:fields.name,description:fields.description});
        res.send(updatedActivity.activity)

    } else {
        res.send({
            error: 'error',
            message: `Activity ${id} not found`,
            name: 'errorMessage'
        })
    }

})
module.exports = router
