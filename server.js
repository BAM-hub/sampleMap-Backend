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
    console.log('cords', markerCords);
    socket.emit('initial-coords',  {id: user.id, markerCords});
    // socket.emit('get_answer', {
    //   userId: '1',
    //   driverId: '712db4c5-3a2c-4eb7-abe5-39e61faa0d5e',
    //   coords: { latitude: 32.02259893679403, longitude: 35.71472254169467 }
    // });
    // socket.emit('get_answer', {
    //   userId: '2',
    //   driverId: '712db4c5-3a2c-4eb7-abe5-39e61faa0d5e',
    //   coords: { latitude: 32.02259893679403, longitude: 35.71472254169467 }
    // });
    // socket.emit('new_user', {"coords":
    //  {"latitude": 32.070323314173926,
    //   "longitude": 35.71175236694424},
    //   "id": "712db4c5-3a2c-4eb7-abe5-39e61faa0d5e",
    //   "line": "60 st.",
    //   "name": "BAM",
    //    "type": "passenger"});
    
    // socket.emit('answer', { 
    //   userId: user.id,
    //    driverId: '1',
    //     coords: { latitude: 32.02259893679403, longitude: 35.71472254169467 }
    //   });
  });

  socket.on('user_live', user => {
      socket.to('passenger').to('captin').emit('new_user', user);
  });

  socket.on('leave', user => socket.leave(user.id));

  socket.on('driverBroadcast', user => {
    console.log('broadcast', user)
    socket.to('passenger').emit('changeLocation', user);
  });

  socket.on('ride_request', request => {
    // console.log(request)
    // let answer = inLine(request.location);
    // console.log(answer)
    console.log(request)
    // if(answer)
      socket.to('captin').emit('get_answer', request);
    // socket.emit('rideResponse', { ...request, ...answer });
  });

  socket.on('answer', answer => {
    // console.log(answer);
    socket.to('passenger').emit('answer', answer);
  });

  socket.on('cancelRide', ride => {
    socket.to(ride.driverId).emit('cancelRide', ride);
  });

  socket.on('disconnect', () => {
    // console.log('left')
    const user = getUser(socket.id);
    // console.log('user', user);
    userLeave(socket.id);
    socket.to('captin').to('passenger').emit('user_disconnect', user);
    // socket.to(res.type).emit('update-coords', res.data);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});