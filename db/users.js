const client = require("./client");
const bcrypt = require('bcrypt')
const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    const { rows: [user] } = await client.query(`
      INSERT
      INTO
      users(username,password)
      VALUES($1,$2) RETURNING *;`, [username, hashedPassword]);
    delete user.password
    return user;
  } catch (error) { throw new Error('cannot create user') }
}


async function getUser({ username, password }) {
  try {
    const userWeGetting = await getUserByUsername(username)
    const hashedPassword = userWeGetting.password
    const comparePasswords = await bcrypt.compare(password, hashedPassword);
    if (comparePasswords) {
      delete userWeGetting.password
      return userWeGetting
    } else {
      console.error('that didnt work')
      return null
     }
  } catch (error) {
    throw new Error('can\'t get single user')
  }
}

async function getUserById(userId) {
  try{
    const {rows:[user]} = await client.query(`
    SELECT * 
    FROM users 
    WHERE id=${userId};`);
    delete user.password
    return user
  }catch(error){
    throw new Error('cant get user by id')
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE username=$1;`,[userName]);
    return user
  } catch (error) {
    throw new Error('cant get user by username')
  }
}


  module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
  }
