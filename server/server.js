require('dotenv').config({
  path: 'variables.env'
});

const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const port = process.env.PORT || 8500;

const level = require('level');
const db = level('../blockchain.db', { valueEncoding: 'json' });

/**
 * Express Setup
 */

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/**
 * Socket
 */

require('./io').initialize(http);
const io = require('./io').io();

/**
 * Routes
 */

app.post('/new-vote', function(req, res) {
  io.emit('MINE', req.body);
  res.send('Received');
});

app.post('/new-block', function(req, res) {
  const block = req.body;
  console.log('BLOCK', block);

  db.put(block.hash, block);

  io.emit('BLOCK', block);
  res.send('Received');
});

/**
 * Start server
 */

http.listen(port, function() {
  console.log(`listening on *:${port}`);
});
