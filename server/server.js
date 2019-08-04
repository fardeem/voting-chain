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

app.get('/blockchain', function(req, res) {
  const values = [];

  db.createReadStream()
    .on('data', function(data) {
      // console.log(data.key, '=', data.value);
      values.push(data.value);
    })
    .on('error', function(err) {
      console.log('Oh my!', err);
    })
    .on('close', function() {
      console.log('Stream closed');
      res.json(values);
      // console.log(values);
    })
    .on('end', function() {
      console.log('Stream ended');
    });
});
/**
 * Start server
 */

http.listen(port, function() {
  console.log(`listening on *:${port}`);
});
