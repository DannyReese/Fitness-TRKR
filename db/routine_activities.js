const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}){
  try{
 const { rows:routineActivity } = await client.query(`
 INSERT INTO "routineActivites"(
  "routineId",
  "activityId",
  count,duration)
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
    const { rows:routineActivity } = await client.query(`
    SELECT "routineId" 
    FROM routine_activities 
    WHERE id = $1
    RETURNING *;`,
    [id]);

   return routineActivity;
 } catch(error){
   throw new Error('cannot get routine_activity by the id')
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try{
    const { rows:routineActivity } = await client.query(`
    SELECT *
    FROM routine_activities 
    WHERE "routineId" = ${id}`);

    return routineActivity;
  } catch(error){
    throw new Error('cannot get routine_activity by the routine')
  }
}

async function updateRoutineActivity({ id, ...fields }) {
 try{
  const { count, duration } = fields
  let updateFields 

  if(count) {
    const { rows:[updatedRoutineActivity] } = await client.query(`
    UPDEATE routine_activites 
    SET count = $1
    WHERE id=$2
    RETURNING *;`,
    [count, id]);

    returnValue = updatedRoutineActivity
  }

 if (duration){
  const { rows:[updatedRoutineActivity] } = await client.query(`
  UPDATE routine_activities
  SET duration = $1
  WHERE id=$2
  RETURNING *;`,
  [duration,id]);

  returnValue = updatedRoutineActivity
 }

  return returnValue;
} catch(error){
  throw new Error('cannot update the routine_activity ')
}

async function destroyRoutineActivity(id) {
  try{
    const { rows: [deletedRoutine] } = await client.query(`
    DELETE FROM routine_activites 
    WHERE id=$1
    RETURNING *;`,
    [id]);

    return deletedRoutine
  } catch(error){
    throw new Error('unable to delete the routine activity')
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try{
    const { rows: [routineId] } = await client.query(`
    SELECT "routineId"
    FROM routine_activites
    WHERE id=$1;`,
    [routineActivityId]);

    const { rows: [routineCreatorId] } = await client.query(`
    SELECT "creatorId"
    FROM routines
    WHERE id=$1;`,
    [routineId.routineId]);

    if (routineCreatorId.creatorId === userId) {
      return true
    } else {
      return false
    }
  } catch(error) {
    throw new Error('cannot edit answer')
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
