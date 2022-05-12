let captins = [
  {"cords": {"latitude": 31.5219983, "longitude": -120.084}},
  {"cords": {"latitude": 37.4219983, "longitude": -122.084}}
];
let users = [
  {"cords": {"latitude": 30.5219983, "longitude": -120.084}},
  {"cords": {"latitude": 37.4219983, "longitude": -122.084}}
];

function userJoin(user) {
  if(user.type === 'captin')
    return captins.push(user);
  users.push(user);
};

function userLeave(id, type) {
  if(type === 'passenger') {
    const index = users.findIndex(user => user.id === id);
    if( index !== -1 ) {
      return users.splice(index, 1)[0];
    }
  }
  
  const index = captins.findIndex(captin => captin.id === id);
  if( index !== -1 ) {
    return captins.splice(index, 1)[0];
  }
};

//this function should return the array of users that ur allowed to see
function getMarkerCords(type) {
  if(type === 'captin')
    return users;
  return captins;
}

module.exports = {
  userJoin,
  userLeave,
  getMarkerCords
};