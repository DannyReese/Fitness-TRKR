const express = require('express');
const router = express.Router();
const{getAllPublicRoutines}=require('../db')
// GET /api/routines
router.get('/',async(req,res)=>{
    try{
        const routines = await getAllPublicRoutines()
        res.send(routines)
    }catch(error){throw new Error('cannot get routines')}
})
// POST /api/routines
router.post('/')
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
