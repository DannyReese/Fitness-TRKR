const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}){
  try{
 const {rows:routineActivity} = await client.query(`
 INSERT INTO
 "routineActivites"("routineId","activityId",count,duration)
 VALUES($1,$2,$3,$4) 
 RETURNING *;`,
 [routineId,
  activityId,
  count,
  duration]);

 //console.log(routineActivity);

  return routineActivity
} catch(error){
  throw new Error('cannot add activity to the "routineActivites"')}}

async function getRoutineActivityById(id) {
  try{
    
  }
}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
