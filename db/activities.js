const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities (name,description)
    VALUES ($1,$2)
    RETURNING *;
    `, [name, description]);
    return activity;
  } catch (error) {
    throw new Error("Can't create activity")
  }
}

async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(`
    SELECT * 
    FROM activities;
    `);
    console.log('these all the activities', activities);
    return activities
  } catch (error) {
    throw new Error('cant get all activities')
  }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT *
    FROM activities
    WHERE id=$1;
    `, [id]);
    return activity;
  } catch (error) {
    throw new Error("Cannot get activity by ID")
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
    `, [name]);
    return activity;
  } catch (error) {
    throw new Error("Cannot get activity by name")
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  try {
    const activities = await getAllActivities();
    return routines.map(routine => {
      routine.activities = activities.filter(activity => activity.routine_id === routine.id);
      return routine;
    });
  } catch (error) {
    throw new Error("Cannot attach activities to routines")
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  try {
    const { name, description } = fields;

    let returnValue;

    if (name) {
      const { rows: [activity] } = await client.query(`
        UPDATE activities 
        SET name = $1
        WHERE id=$2
        RETURNING *;
        `, [name, id]);
      returnValue = activity;
    }

    if (description) {
      const { rows: [activity] } = await client.query(`
        UPDATE activities 
        SET description = $1
        WHERE id=$2
        RETURNING *;
        `, [description, id]);
      returnValue = activity;
    }

    if (!name && !description) {
      throw new Error('Nothing to update')
    }

    return returnValue;

  } catch (error) {
    throw new Error('Cannot update activity')
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
