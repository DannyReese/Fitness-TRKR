const client = require("./client");
const bcrypt = require('bcrypt')
const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username,password)
      VALUES($1,$2)
      RETURNING *;
      `, [username, hashedPassword]);
    delete user.password;
    return user;
  } catch (error) {
    throw new Error('Cannot create user')
  }
}

async function getUser({ username, password }) {
  try {
    const userWeGetting = await getUserByUsername(username);
    const hashedPassword = userWeGetting.password;
    const validPassword = await bcrypt.compare(password, hashedPassword);

    if (validPassword) {
      delete userWeGetting.password;
      return userWeGetting;
    }
    else {
      return;
    }
  } catch (error) {
    throw new Error("Cannot get user")
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE id=${userId}
    `);
    delete user.password;
    return user;
  }
  catch (error) {
    throw new Error("Can't get user by ID");
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE username=$1;
    `, [username]);

    return user;
  }
  catch (error) {
    throw new Error("Cannot get user by username");
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
