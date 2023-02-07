const client = require("./client");
const { attachActivitiesToRoutines } = require('./activities')


async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
    INSERT INTO routines
    ("creatorId", "isPublic", name, goal)
    VALUES
    ($1,$2,$3,$4)
    RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine
  } catch (error) { throw new Error("Cannot create routine") }
}


async function getRoutineById(id) {
  try {
    const routines = await getAllRoutines()
    const routineById = routines.filter(routine => routine.id === id)
    return routineById
  } catch (error) {
    throw new Error("Cannot get routine by id")
  }
}


async function getRoutinesWithoutActivities() {
  try {
    const { rows: routine } = await client.query(`
    SELECT * 
    FROM routines;`);
    return routine
  } catch (error) {
    throw new Error("Cannot get routines without activities")
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*,
    users.username AS "creatorName"
    FROM routines
    JOIN users
    ON users.id = routines."creatorId"
   `);

    for (const routine of routines) {
      routine.activities = await attachActivitiesToRoutines(routine)
    }

    return routines;

  } catch (error) {
    throw new Error("Cannot get all routines")
  }
}

async function getAllPublicRoutines() {
  try {
    const routines = await getAllRoutines()
    const pubRoutines = routines.filter(routine => routine && routine.isPublic === true);

    return pubRoutines
  } catch (error) { throw new Error("Cannot get all public routines") }
}


async function getAllRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutines()
    const userRoutines = routines.filter(routine => routine && routine.creatorName === username)

    return userRoutines
  } catch (error) {
    throw new Error("Cannot get all routines by user")
  }
}


async function getPublicRoutinesByUser({ username }) {
  try {
    const pubRoutines = await getAllPublicRoutines()

    const pubUserRoutines = pubRoutines.filter(routine => routine && routine.creatorName === username)

    return pubUserRoutines
  } catch (error) {
    throw new Error("Cannot get public routines by user")
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const pubRoutines = await getAllPublicRoutines()
    for (const routine of pubRoutines) {
      const actRoutine = routine.activities.filter(act => act.id === id)
      if (actRoutine.length > 0) {
        const routine = await getRoutineById(actRoutine[0].routineId)
        return routine
      }
    }

  } catch (error) {
    throw new Error("Cannot get public routines by activity")
  }
}

async function updateRoutine({ id, ...fields }) {
  try {
    const { isPublic, name, goal } = fields

    let returnValue

    if (!isPublic !== null && isPublic !== undefined) {
      const { rows: [updatedRoutine] } = await client.query(`
          UPDATE routines 
          SET "isPublic" = $1
          WHERE id=$2
          RETURNING *;
          `, [isPublic, id]);
      returnValue = updatedRoutine
    }

    if (name) {
      const { rows: [updatedRoutine] } = await client.query(`
          UPDATE routines 
          SET name = $1
          WHERE id=$2
          RETURNING *;
          `, [name, id]);
      returnValue = updatedRoutine
    }

    if (goal) {
      const { rows: [updatedRoutine] } = await client.query(`
          UPDATE routines 
          SET goal = $1
          WHERE id=$2
          RETURNING *;
          `, [goal, id]);
      returnValue = updatedRoutine
    }
    if (name === undefined && isPublic === undefined && goal === undefined) {
      throw new Error("Fields are undefined")
    }

    return returnValue
  } catch (error) { throw new Error("Cannot update routine") }
}

async function destroyRoutine(id) {
  try {

    await client.query(`
    DELETE FROM
    routine_activities
    WHERE "routineId"=${id};
    `);

    await client.query(`
    DELETE FROM
    routines
    WHERE id=${id};
    `);

  } catch (error) {
    throw new Error("Cannot destroy routine")
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