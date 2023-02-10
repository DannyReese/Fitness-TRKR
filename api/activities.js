const express = require('express');
const { getPublicRoutinesByActivity } = require('../db');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get(`/:activityId/routines`, async (req, res, next) => {
    try {
        const activities = await getPublicRoutinesByActivity({ id: req.params.activityId });

        if (activities) {
            res.send(activities);
        }
        else {
            next({
                name: 'name'
                message: `Activity ${activities} not found`
            })
        }
    }
    catch (error) {
        next(error)
    }
});

// GET /api/activities

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
