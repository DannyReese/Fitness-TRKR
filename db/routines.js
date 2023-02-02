const client = require("./client");
const {attachActivitiesToRoutines} = require('./activities')
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
    JOIN users 
    ON users.id = routines."creatorId"
    WHERE routines.id=$1`, [id]);

    // if (!routine) {
    //   throw {
    //     name: "PostNotFoundError",
    //     message: "Could not find a post with that postId"
    //   };
    // }
    // const routineWactiviy = await attachActivitiesToRoutines(routine)
    // console.log(routineWactiviy)
    // const { rows: [routineActivity] } = await client.query(`
    // SELECT * FROM routine_activities WHERE "routineId"=$1`, [id]);


    
    // routineWactiviy.duration = routineActivity.duration
    // routineWactiviy.count = routineActivity.count
  
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
    SELECT routines.*,
    users.username AS "creatorName"
    FROM routines
    JOIN users ON users.id = routines."creatorId"
   `)

    
    // const final = await Promise.all(ids.map(id => id.activities = attachActivitiesToRoutines(id)));
    // console.log('this is final',final)
   
    
   for(let i = 0 ; i < ids.length;i++){
    ids[i].activities = await attachActivitiesToRoutines(ids[i])
   }
   console.log(ids)
   return ids;
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
