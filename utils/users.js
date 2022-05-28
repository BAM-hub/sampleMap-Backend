const geolib = require('geolib');
const { line } = require('../line.js');

// let test = { latitude: 22.02159504627019, longitude: 25.71390630925344 };

let captins = [
  {
    'sid': '0',
    'id': '0',
    'name': 'BAM',
    'line': 'Amman As-Salt',
    'distance': 'Calculating',
    'time': 'Calculating',
    'coords': {
        'latitude': 31.966882,
        'longitude': 35.988638
    }
},
{
    'sid': '1',
    'id': '1',
    'name': 'Ali',
    'line': 'Amman As-Salt',
    'distance': 'Calculating',
    'time': 'Calculating',
    'coords': {
        'latitude': 31.963817,
        'longitude': 35.975449
    },

  },
];
let users = [
  {
    'sid': '2',
    'id': '2',
    'name': 'BAM',
    'line': 'Amman As-Salt',
    'coords': {
            'latitude': 31.966882,
            'longitude': 35.988638
    },
  },
  {
    'sid': '3',
    'id': '3',
    'name': 'Ali',
    'line': 'Amman As-Salt',
    'coords': {
        'latitude': 31.963817,
        'longitude': 35.975449
    },
  },
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
      users = users.splice(index, 1)[0];
      return users;
    }
  }
  
  const index = captins.findIndex(captin => captin.id === id);
  if( index !== -1 ) {
    captins = captins.splice(index, 1)[0];
    return captins;
  }
};

//this function should return the array of users that ur allowed to see
function getMarkerCords(type) {
  if(type === 'captin')
    return users;
  return captins;
}

function inLine(coords) {
  const answer = line.filter((l => geolib.getDistance(l, coords) < 100));
  if(answer.length > 0)
    return {
      status: true
    }
  return {
    status: false
  }
}
module.exports = {
  userJoin,
  userLeave,
  getMarkerCords,
  inLine
};