const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities
    (name,description)
    VALUES
    ($1,$2)RETURNING *;`, [name, description])
    console.log(activity)
    return activity
  } catch (error) {
    throw new Error('cant create activity')
  }

}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: activities } = await client.query(`SELECT * FROM activities;`);
    console.log('these all the activities', activities);
    return activities
  } catch (error) { throw new Error('cant get all activities') }
}

async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT *
    FROM activities
    WHERE id=$1;`, [id]);
    return activity
  } catch (error) {
    throw new Error('cant get activity by id')
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;`, [name]);
    return activity
  } catch (error) {
    throw new Error('cant get activity by name')
  }
}

async function attachActivitiesToRoutines(routines) {
  try{
    const {rows : activities} = await client.query(`
    SELECT * FROM activities;`);

  }catch(error){
    throw new Error('cant attach activity to routine')
  }
}

async function updateActivity({ id, ...fields }) {
  
  const { name, description } = fields

  let returnValue

  try {
    if (name) {
      const { rows: [activity] } = await client.query(`
        UPDATE activities 
        SET name = $1
        WHERE id=$2 RETURNING *;
        `, [name, id]);
      returnValue = activity
    }

    if (description) {
      const { rows: [activity] } = await client.query(`
        UPDATE activities 
        SET description = $1
        WHERE id=$2 RETURNING *;
        `, [description, id]);
      returnValue = activity
    }

    if(name === undefined && description === undefined){
      throw new Error('fields are undefined')
    }

    return returnValue

  } catch (error) {
    throw new Error('cant update activity')
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
