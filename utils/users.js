let captins = [];
let users = [];

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