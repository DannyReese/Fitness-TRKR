const express = require('express');
const router = express.Router();
const { getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine } = require('../db')
// GET /api/routines
// router.get('/',async(req,res)=>{
//     try{
//         const routines = await getAllPublicRoutines()
//         res.send(routines)
//     }catch(error){throw new Error('cannot get routines')}
// })


router.get("/", async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();
        if (routines) {
            res.send(routines);
        }
    }
    catch (error) {
        next(error)
    }
});

// POST /api/routines
router.post('/', async (req, res) => {
    try {
        const user = req.user
        if (user) {
            const fields = req.body
            fields.creatorId = user.id
            const newRoutine = await createRoutine(fields)

            res.send(newRoutine)
        } else {
            res.send({
                error: 'must be logged in',
                message: "You must be logged in to perform this action",
                name: "NotLoggedIn"
            })
        }
    } catch (error) {
        throw new Error('cant create routine')
    }
})

// PATCH /api/routines/:routineId
router.patch('/:routineId', async (req, res) => {
    const user = req.user
    console.log(user)
    if (user) {
        const fields = req.body

        const id = parseInt(req.params.routineId)

        const authorization = await getRoutineById(id)

        if (authorization[0].creatorId === user.id) {
            fields.id = id
            const updatedRoutine = await updateRoutine(fields)

            res.send(updatedRoutine)
        } else {
            res.status(403).send({
                error: "error",
                message: `User ${user.username} is not allowed to update Every day`,
                name: 'NotOwner'
            })
        }

    } else {
        res.send({
            error: "error",
            message: "You must be logged in to perform this action",
            name: 'NotLoggedIn'
        })
    }
})
// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
