const express = require('express');
const router = express.Router();
const {
       getAllPublicRoutines,
       createRoutine,
       updateRoutine,
       destroyRoutine,
} = require('../db/routines');
const { addActivityToRoutine } = require('../db/routine_activities');
const { requireUser } = require('./users');
       


// GET /api/routines
routineRouter.get("/", async(req,res,next) => {
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
routinesRouter.post("/", requireUser, async(req, res,next) => {
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
routinesRouter.patch('')






// DELETE /api/routines/:routineId






// POST /api/routines/:routineId/activities






module.exports = router;
