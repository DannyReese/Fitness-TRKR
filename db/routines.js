const client = require("./client");
const { attachActivitiesToRoutines } = require('./activities')


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

    return routine
  } catch (error) {
    throw new Error('cant get routine by id')
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routine } = await client.query(`
    SELECT * 
    FROM routines;`);
    return routine
  } catch (error) {
    throw new Error('cant get routines')
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*,
    users.username AS "creatorName"
    FROM routines
    JOIN users ON users.id = routines."creatorId"
   `);

    for (let i = 0; i < routines.length; i++) {
      routines[i].activities = await attachActivitiesToRoutines(routines[i])
    }

    return routines;

  } catch (error) {
    console.log(error)
  }
}

async function getAllPublicRoutines() {
  try {
    const routines = await getAllRoutines()
    const pubRoutines = routines.filter(routine => routine && routine.isPublic === true);
   
    return pubRoutines
  } catch (error) { throw new Error('cant get puplic routines') }
}

async function getAllRoutinesByUser({ username }) { 
try{
    const routines = await getAllRoutines()
    const userRoutines = routines.filter(routine=>routine&&routine.creatorName === username)
   
    return userRoutines
  }catch(error){
    throw new Error('cant get routine by username')
  }
}

async function getPublicRoutinesByUser({ username }) { 
  try{
  const pubRoutines = await getAllPublicRoutines()
  
  const pubUserRoutines = pubRoutines.filter(routine => routine&&routine.creatorName === username)

  return pubUserRoutines
  }catch(error){
    throw new Error('cant get public user routines')
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    console.log(id)
    const pubRoutines = await getAllPublicRoutines()
    // console.log(pubRoutines[2])
    // console.log(pubRoutines[2].activities[1].routineId)
    // const routineFromActivty = pubRoutines.filter(routine=> routine.activities.id === id)
    for(const routine of pubRoutines){
      const activtyrout = routine.activities.map(act => act.id === id)
      if(activtyrout.length){
        return activtyrout
      }else{continue}
    }
    // console.log(routineFromActivty)
    // return routineFromActivty[0]
  } catch (error) {
    throw new Error('can get public routines by Actvity')
  }
 }

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
