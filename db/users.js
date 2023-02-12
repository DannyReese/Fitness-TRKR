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
      VALUES($1,$2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;`, [username, hashedPassword]);
    if (user) {
      delete user.password;
      return user;
    } else {
      console.error('name aleady used');
    }
  } catch (error) { console.warn(error) }
}


async function getUser({ username, password }) {
  try {

    const userWeGetting = await getUserByUsername(username);
    const hashedPassword = userWeGetting.password;
    const comparePasswords = await bcrypt.compare(password, hashedPassword);

    if (comparePasswords) {
      delete userWeGetting.password;
      return userWeGetting;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error('can\'t get single user');
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT * 
      FROM users 
      WHERE id=${userId};`);
    delete user.password;
    return user;
  } catch (error) {
    throw new Error('cant get user by id');
  }
}

async function getUserByUsername(username) {
  try {

    const { rows: user } = await client.query(`
      SELECT *
      FROM users;`);
    const users = user.filter(u => u.username === username);

    return users[0]
  } catch (error) {
    throw new Error('cant get user by username');
  }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
