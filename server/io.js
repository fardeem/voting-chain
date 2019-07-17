const sio = require('socket.io');

let io = null;
let connectionCount = 0;

exports.io = function() {
  return io;
};

exports.initialize = function(http) {
  io = sio(http);

  io.on('connection', socket => {
    connectionCount++;
    console.log(
      `A user connected with ${socket.id}`,
      `Total connection: ${connectionCount}`
    );

    socket.on('disconnect', function() {
      connectionCount--;
      console.log(
        `A user disconnected with id ${socket.id}`,
        `Total connection: ${connectionCount}`
      );
    });
  });
};
