const express = require('express');
const { getAllActivities } = require('../db');
const router = express.Router()
// const activitiesRouter = router

router.use((req,res,next)=>{
    console.log('sending something from activities')
    next()
})
// GET /api/activities/:activityId/routines
router.get('/',async(req,res,next)=>{
    try{
    const allActivities = await getAllActivities()
    console.log(allActivities)
    res.send(allActivities)
    }catch(error){
        next(error)
    }
})
// GET /api/activities

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router
