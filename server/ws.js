function onConnect(socket) {
  console.log('a user has connected.');

  socket.on('disconnect', () => console.log('A user has disconnected'));
}

module.exports = function startServer(io) {
  io.on('connect', onConnect);
};
