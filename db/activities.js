const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try{
   const {rows : activity } = await client.query(`
    INSERT INTO activities
    (name,description)
    VALUES($1,$2)
    RETURNING *;`,
    [name,description])
    
    return activity
  } catch(error){
    throw new Error('cannot create activity')
  }
  
}

async function getAllActivities() {
  // select and return an array of all activities
  try{
    const {rows : activities} = await client.query(`
    SELECT * 
    FROM activities;`);

    return activities
  } catch(error){
    throw new Error('cannot get to all activities')}
}

async function getActivityById(id) {
  try{
    const {rows:[activity]} = await client.query(`
    SELECT *
    FROM activites
    WHERE id=$1;`, [id]);
    return activity
  } catch (error) {
    throw new Error('cannot get activity by the id')
  }
}

async function getActivityByName(name) {
  try{
    const {rows:[activity]} = await client.query(`
    SELECT+
    FROM activities 
    WHERE name=$1;`, [name]);

    return activity 
  } catch (error) {
    throw new Error('cannot get activity by the name')
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  try{
    const{rows: activity} = await client.query(`
    SELECT
    activities.*,
    routines_activites.duration,
    routine_activites.count,
    routine_activities.id AS "routineActivityId",
    routine_activites."routineId"
    JOIN routine_activites
    ON routine_activities. "routineId"=$1;`,[routines.id]);
    return activity
  } catch (error) {
    throw new Error('cannot attach activity to the routine')
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const { name, description } = fields

  let returnValue

  try{
    if(name) {
      const {rows:[activity]} = await client.query(`
      UPDATE activites 
      SET name = $1
      WHERE id=$2 RETURNING *;
      `,[name, id]);
      returnValue = activity
    }
    if(description){
      const{rows:[activity]} = await client.query(`
      UPDATE activities 
      SET description = $1
      WHERE id=$2 RETURNING *;
      `, [description, id]);
      returnValue= activity 
    }
    if(name === undefined && description === undefined) {
      throw new Error('fields are undefined')
    }
    return returnValue
  } catch(error) {
    throw new Error('cannot update the activity')
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
