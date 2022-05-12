const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { userJoin, userLeave, getMarkerCords } = require('./utils/users');

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer);


io.on('connection', socket => {
  console.log(socket.id);

  socket.on('join', user => {
    socket.join(user.type);
    userJoin(user);
    const markerCords = getMarkerCords(user.type);
    console.log('cords', markerCords);
    socket.emit('initial-coords', markerCords);
  });

  // socket.on('location-update', (id, cords, type) => {
  //   const localType = TYPES.filter(TYPE => type !== TYPE);
  //   socket.to(localType).emit('cords-update', ({id, cords}));
  // });

  // socket.on('disconnect', user => {
  //   userLeave(user.id, user.type);
  //   const type = TYPES.filter(TYPE => user.type !== TYPE);
  //   socket.to(type[0]).emit('user-left', user.id);
  //   console.log('disconnected');
  // });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});