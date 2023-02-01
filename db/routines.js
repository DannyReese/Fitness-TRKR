const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
    INSERT INTO routines
    ("creatorId", "isPublic", name, goal)
    VALUES
    ($1,$2,$3,$4) RETURNING *;`, [creatorId, isPublic, name, goal]);

    return routine
  } catch (error) { throw new Error('no routine made') }
}

async function getRoutineById(id) {
  try {
   
    const { rows: [routine] } = await client.query(`
    SELECT routines.*,users.username 
    AS "creatorName" FROM
    routines
    INNER JOIN users 
    ON users.id = routines."creatorId"
    WHERE routines.id=$1`, [id]);
    if (!routine) {
      throw {
        name: "PostNotFoundError",
        message: "Could not find a post with that postId"
      };
    }
    const { rows: activities } = await client.query(`
    SELECT * FROM activities;`)

    const { rows: [routineActivity] } = await client.query(`
    SELECT * FROM routine_activities WHERE "routineId"=$1`, [id]);

    const activityArr = activities.filter(activity => activity.id === routineActivity["activityId"])
    routine.activities = activityArr
    routine.duration = routineActivity.duration
    routine.count = routineActivity.count
  
   
    return routine
  } catch (error) {
    throw new Error('cant get routine by id')
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routine } = await client.query(`SELECT * FROM routines;`);
    return routine
  } catch (error) {
    throw new Error('cant get routines')
  }
}

async function getAllRoutines() {
  try {
    const { rows: ids } = await client.query(`
    SELECT id FROM routines;`)
    console.log(ids)

    const routines = await Promise.all(ids.map((id) =>{getRoutineById(id.id)}));
    console.log(routines)
   return routines
   
  } catch (error) { console.log(error) }
}

async function getAllPublicRoutines() { }

async function getAllRoutinesByUser({ username }) { }

async function getPublicRoutinesByUser({ username }) { }

async function getPublicRoutinesByActivity({ id }) { }

async function updateRoutine({ id, ...fields }) { }

async function destroyRoutine(id) { }

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
