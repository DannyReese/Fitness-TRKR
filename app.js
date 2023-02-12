require("dotenv").config()
const express = require("express")
const app = express()
const router = require('./api')
const cors = require('cors')
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  // console.log('beginning router');

  next()
})

app.use("/api", router);

app.get('*', (req, res) => {
  res.status(404).send({ error: '404 - not found', message: 'No route found for the requested path' })
})

module.exports = app;
