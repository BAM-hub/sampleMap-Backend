const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { userJoin, userLeave, getMarkerCords, inLine, getUser } = require('./utils/users');

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer);


io.on('connection', socket => {
  // console.log(socket.id);

  socket.on('join', user => {
    
    console.log('id', user.id);
    socket.join(user.id);
    socket.join(user.type);
    userJoin({
      ...user,
      sid: socket.id
    });
    const markerCords = getMarkerCords(user.type);
    // console.log('cords', markerCords);
    socket.emit('initial-coords',  {id: user.id, markerCords});
  });

  socket.on('user_live', user => {
      socket.emit('new_user', user);
  });

  socket.on('leave', user => socket.leave(user.id));

  socket.on('driverBroadcast', user => {
    socket.to('passenger').emit('changeLocation', user);
  });

  socket.on('ride_request', request => {
    // console.log(request)
    // let answer = inLine(request.location);
    // console.log(answer)
    // if(answer)
      socket.emit('get_answer', request);
    // socket.emit('rideResponse', { ...request, ...answer });
  });

  socket.on('answer', answer => {
    // console.log(answer);
    socket.to(answer.userId).emit('rideResponse', answer);
  });

  socket.on('cancelRide', ride => {
    socket.to(ride.driverId).emit('cancelRide', ride);
  });

  socket.on('disconnect', () => {
    // console.log('left')
    const user = getUser(socket.id);
    // console.log('user', user);
    userLeave(socket.id);
    socket.emit('user_disconnect', user);
    // socket.to(res.type).emit('update-coords', res.data);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});