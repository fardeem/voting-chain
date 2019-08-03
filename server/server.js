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
app.use(express.static('public'));

require('./io').initialize(http);
const io = require('./io').io();

/**
 * Routes
 */

// app.get('/', function(_, res) {
//   res.sendFile(__dirname + '/index.html');
// });

app.post('/new-vote', function(req, res) {
  io.emit('MINE', req.body);
  res.send('Received');
});

app.post('/new-block', function(req, res) {
  console.log('BLOCK', req.body);
  io.emit('BLOCK', req.body);
  res.send('Received');
});

/**
 * Start server
 */

http.listen(port, function() {
  console.log(`listening on *:${port}`);
});
