const express = require('express');
const { getActivityById } = require('../db');
const router = express.Router();
const {
       getAllPublicRoutines,
       createRoutine,
       updateRoutine,
       destroyRoutine,
       getRoutineById,
} = require('../db/routines');
const { addActivityToRoutine } = require('../db/routine_activities');
const { requireUser } = require('./users');
       


// GET /api/routines
router.get('/', async(req,res,next) => {
  try{
    const routines = await getAllPublicRoutines();
    if(routines){
      res.send(routines);
    }
    else{
      next(error);
    }
  } 
    catch(error) {
      next(error)
  }
});



// POST /api/routines
router.post('/', requireUser, async(req, res,next) => {
  const {isPublic, name, goal} = req.body;
  const creatorId = req.user.id;
  try{
    if (creatorId && isPublic && name && goal) {
      const newRoutine = await createRoutine({
        creatorId,
        isPublic, 
        name, 
        goal

      });
      res.send(newRoutine);
    } else{
      res.send({message:'It is Missing fields'});
    }
  } catch ({name, message}) {
    next({name, message});
  }
} 
)


// PATCH /api/routines/:routineId
router.patch('/routineId', async (req,res,next) => {
  try{
    const user = req.user;

    if(user) {
      const fields = req.body;

      const id = parseInt(req.params.routineId);

      const authorization = await getRoutineById(id);

      if(authorization[0].creatorId === user.id) {
        fields.id = id;
        const updatedRoutine = await updateRoutine(fields);

        res.send(updatedRoutine);
      } else {
        res.status(403).send({
          error:'error',
          message: 'User ${user.username} is not allowed to update every day',
          name:'NotOwner'
        });
      }
    } else {
      res.send({
        error:'error',
        message:'You must be logged in to perform action',
        name:'NotLoggedIn'
      });
    }
  } catch(error) {
    next(error);
  }
});


// DELETE /api/routines/:routineId
router.delete(`/:routineId`, requireUser, async (req,res,next) => {
  try{
    const post = await getRoutineById(req.params.postId);

    if(post && post.authpr.id === req.params.postId) {
      const updatedPost = await destroyRoutine(post.id, {active:false});

      res.send({post:routineCopy});
    } else{
      next(post ? {
        name:'User Error',
        message:'You cannot delete a post that is not yours'
      }:{
        name:'Post Not found Error',
        message:'That post does not exist'
      });

      }
    } catch ({name:message}) {
      next ({name:message})
    }


  });


// POST /api/routines/:routineId/activities

router.post(`/:routineId/activities`, async(req,res,next) => {
  try{
    const routineId = paraseInt(req.params.routineId);
    const activity = req.body;
    const activityId = activity.activityId;

    const routine = await getRoutineById(routineId);

    const arr = routine[0].activities.filter(a => a.id === activityId);

    if (!arr.length){
      const returnVal = await addActivityToRoutine(activity);
      res.send(returnVal);
    } else{
      res.send({
        error:'error',
        message:'Activity ID ${activity.activityId} already exists in Routine ID ${activity.routineId}',
        name:'already'
      });
    }
  } catch(error) {
    next(error);
  }
});




module.exports = router;
