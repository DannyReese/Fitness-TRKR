const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
    const {rows : routine} = await client.query(`
    INSERT INTO routines
    ("creatorId", "isPublic", name, goal)
    VALUES($1,$2,$3,$4) 
    RETURNING *;`,
    [creatorId,isPublic,name,goal]);

    return routine
  } catch(error){
    throw new Error('no routine was made')}
}

async function getRoutineById(id) {
  try{
    const routines = await getAllRoutines()
    const routineById = routines.filter(routine => routine.id === id)

    return routineById
  } catch (error) {
    throw new Error('cannot get routine by the id')
  }
}

async function getRoutinesWithoutActivities() {
  try{
    const {rows:routine} = await client.query(
    `SELECT * 
     FROM routines;`);

     return routine
  }  catch(error){
     throw new Error('sorry cant get routines')
  }
}

async function getAllRoutines() {
  try{
    const {rows:routines} = await client.query(`
    SELECT routines.*,
    users.username AS "creatorName
    FROM routines
    JOIN users ON users.id = routines."creatorId"
    `);
    for(const routine of routines) {
      routine.activities = await attachActivitiesToRoutines(routine)
    }

    return routines;
  } catch (error) {
    throw new Error('cannot get to all routines')
  }
}

async function getAllPublicRoutines() {
  try{
    const routines = await getAllRoutines()
    const pubRoutines = routines.filter(routine => routine && routine.isPublic === true);

    return pubRoutines
  } catch (error) {
    throw new Error('cannot get to public routines')}
}

async function getAllRoutinesByUser({ username }) {
  try{
    const {rows:routines} = await client.query(`
    SELECT routines.*,
    users.username AS "creatorName"
    FROM routines
    JOIN users ON users.id = routines."creatorId"
    `);
    for(const routine of routines){
      routine.activites = await attachActivitiesToRoutines(routine)
    }

    return routines;
  } catch (error) {
    throw new Error('cannot get to all routines')
  }
}

async function getPublicRoutinesByUser({ username }) {
  try{
    const pubRoutines = await getAllPublicRoutines()
    const pubUserRoutines = pubRoutines.filter(routine => routine && routine.creatorName === username)

    return pubUserRoutines
  } catch (error) {
    throw new Error('cannot get public users routines')
  }
}
  


async function getPublicRoutinesByActivity({ id }) {
  try{
    const pubRoutines = await getAllPublicRoutines()
    for(const routine of pubRoutines) {
      const actRoutine = routine.activities.filter(act => act.id ===id)
      if(actRoutine.length > 0) {
        const routine = await getRoutineById(actRoutine[0].routineId)
        return routine
      }
    }

  } catch (error) {
    throw new Error('cannot get public routines by the Activity')
  }
}

async function updateRoutine({ id, ...fields }) {
  try{
    const { isPublic, name, goal } = fields
    let returnValue

    if (!isPublic !== null && isPublic !== undefined) {
      const {rows:[updatedRoutine]} = await client.query(`
        UPDATE routines
        SET "isPublic" = $1
        WHERE id=$2 
        RETRUNING *;
      `,[isPublic, id]);
      returnValue = updatedRoutine 
    }
    if(name) {
      const {rows:[updatedRoutine]} = await client.query(`
      UPDATE routines
      SET name = $1
      WHERE id=$2 
      RETURNING *;
      `,[name, id]);
      returnValue = updateRoutine
    }
    if(goal){
      const{ rows: [updatedRoutine]} = await client.query(`
      UPDATE routines
      SET goal =$1
      WHERE id=$2 
      RETURNING *;
      `,[goal, id]);
      returnValue = updatedRoutine
    }
    if(name === undefined && isPublic === undefined && goal === undefined){
      throw new Error('fields are now undefined')
    }
    return returnValue
  } catch(error) {
    throw new Error('cannot update this routine')}
}

async function destroyRoutine(id) {
  try{
    await client.query(`
    DELETE 
    FROM routine_activities
    WHERE "routineId"=
    ${id};`);

    await client.query(`
    DELETE 
    FROM routines
    WHERE id=
    ${id};`);
    
  } catch(error) {
    throw new Error('cannot destroy the routine');
    
  }
}

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
