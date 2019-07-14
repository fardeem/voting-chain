require('dotenv').config({
  path: 'variables.env'
});

const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const port = process.env.PORT || 8500;

app.use(cors());
app.use(express.json());

require('./io').initialize(http);
const io = require('./io').io();

/**
 * Routes
 */

app.get('/', function(_, res) {
  res.sendFile(__dirname + '/index.html');
});

/**
 * Start server
 */

http.listen(port, function() {
  console.log(`listening on *:${port}`);
});
