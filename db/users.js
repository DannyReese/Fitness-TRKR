const client = require("./client");
const bcrypt = require('bcrypt')
const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }) {
    try{
      const hashedPassword = await bcrypt.hash(password,SALT_COUNT)
     const {rows:user} = await client.query(`
      INSERT
      INTO
      users(username,password)
      VALUES($1,$2) RETURNING *;`,[username,hashedPassword]);
      return user;
    }catch(error){throw new Error('cannot create user')}
}

async function getUser({ username, password }) {
  try{
    const {rows:[userWeGetting]} = await client.query(`
    SELECT *
    FROM users
    WHERE username=${username};`,[username]);
    const hashedPassword = userWeGetting.password
    const comparePasswords = await bcrypt.compare(password,hashedPassword);
    if(comparePasswords){
      delete userWeGetting.password
      return userWeGetting
    }else{
      throw new Error('that didnt work')
    }
  }catch(error){
    throw new Error('can\'t get single user')
  }
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
