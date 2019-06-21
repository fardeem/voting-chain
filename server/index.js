const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const wsServer = require('./ws');
const port = 4000;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

wsServer(io);

server.listen(port, function() {
  console.log(`listening on *:${port}`);
});
