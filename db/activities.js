const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try{
   const {rows : activity } = await client.query(`
    INSERT INTO activities
    (name,description)
    VALUES
    ($1,$2)RETURNING *;`,[name,description])
return activity
  }catch(error){
    throw new Error('cant create activity')
  }
  
}

async function getAllActivities() {
  // select and return an array of all activities
  try{
    const {rows : activities} = await client.query(`SELECT * FROM activities;`);
    console.log('these all the activities',activities);
    return activities
  }catch(error){throw new Error('cant get all activities')}
}

async function getActivityById(id) {}

async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
