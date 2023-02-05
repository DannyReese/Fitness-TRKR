const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      INSERT INTO routine_activities (
      "routineId",
      "activityId",
      count,
      duration
      )
      VALUES($1,$2,$3,$4) 
      RETURNING *;`,
      [routineId, activityId, count, duration]);

    return routineActivity
  } catch (error) {
    throw new Error('cant add activity to "routineActivites"')
  }
}



async function getRoutineActivityById(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      SELECT *
      FROM routine_activities 
      WHERE id=${id}`);

    return routineActivity;

  } catch (error) {
    throw new Error('cannot get routine_activity by id')
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routineActivity } = await client.query(`
      SELECT *
      FROM routine_activities 
      WHERE "routineId"=${id}`);

    return routineActivity;

  } catch (error) {
    throw new Error('cannot get routine_activity by routine')
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const { count, duration } = fields
    let returnValue

    if (count) {
      const { rows: [updatedRoutineActivity] } = await client.query(`
        UPDATE routine_activities 
        SET count = $1
        WHERE id=$2 
        RETURNING *;`, [count, id]);

        returnValue = updatedRoutineActivity
    }

    if (duration) {
      const { rows: [updatedRoutineActivity] } = await client.query(`
        UPDATE routine_activities 
        SET duration = $1
        WHERE id=$2 
        RETURNING *;`, [duration, id]);

        returnValue = updatedRoutineActivity
    }

    return returnValue

  } catch (error) {
    throw new Error('cannot update routine_activity')
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [deletedRoutine] } = await client.query(`
      DELETE FROM routine_activities 
      WHERE id=$1 
      RETURNING *;`, [id]);

    return deletedRoutine
  } catch (error) {
    throw new Error('cannot delete routine activity')
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {

    const { rows: [routineId] } = await client.query(`
      SELECT "routineId" 
      FROM routine_activities 
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
  } catch (error) {
    throw new Error('cannot answer if user can edit')
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
