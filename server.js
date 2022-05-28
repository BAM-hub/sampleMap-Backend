const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { userJoin, userLeave, getMarkerCords, inLine } = require('./utils/users');

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer);


io.on('connection', socket => {
  // console.log(socket.id);

  socket.on('join', user => {
    // console.log('id', user.id)
    socket.join(user.id);
    socket.join(user.type);
    userJoin({
      ...user,
      sid: socket.id
    });
    const markerCords = getMarkerCords(user.type);
    // console.log('cords', markerCords);
    socket.emit('initial-coords', markerCords);
  });

  socket.on('leave', user => socket.leave(user.id));

  socket.on('driverBroadcast', user => {
    socket.emit('changeLocation', user);
  });

  socket.on('raidRequest', request => {
    console.log(request)
    let answer = inLine(request.location);
    console.log(answer)
    if(answer)
      return socket.to(request.driverId).emit('raidRequest', request);
    socket.emit('rideResponse', { ...request, ...answer });
  });

  socket.on('answer', answer => {
    socket.to(request.userId).emit('rideResponse', answer);
  });

  socket.on('cancelRide', ride => {
    socket.to(ride.driverId).emit('cancelRide', ride);
  });

  socket.on('disconnect', () => {
    console.log('left')
    const res = userLeave(socket.id);
    socket.emit('user_disconnect', socket.id);
    socket.to(res.type).emit('initial-coords', res.data);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});