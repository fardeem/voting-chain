const sio = require('socket.io');

let io = null;

exports.io = function() {
  return io;
};

exports.initialize = function(http) {
  io = sio(http);

  io.on('connection', socket => {
    console.log(`A user connected with ${socket.id}`);

    socket.on('disconnect', function() {
      console.log(`A user disconnected with id ${socket.id}`);
    });
  });
};
