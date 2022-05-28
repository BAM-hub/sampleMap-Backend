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
    'type': 'captin',
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
    'type': 'captin',
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
    'type': 'passenger',
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
    'type': 'passenger',
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
  console.log('user', users, '\n', captins)
};

function getUser(sid) {
  console.log(users);
  let user = users.filter(user => user.sid === sid);
  if(user.length !== 0) {
    console.log(user);
    return user[0];
  }

  const index = captins.findIndex(captin => captin.sid === sid);
  if( index !== -1 ) {
    let captin = captins.filter(captin => captin.sid === sid);;
    return captin[0];
  }
}

function userLeave(sid) {
  const index1 = users.findIndex(user => user.sid === sid);
  if( index1 !== -1 ) {
    users = users.filter(user => user.sid !== sid);
    console.log('user', users, '\n cap', captins)
    return {
      data: {...users},
      type: 'captin'
    };
  }
  
  const index = captins.findIndex(captin => captin.sid === sid);
  if( index !== -1 ) {
    captins = captins.filter(captin => captin.sid !== sid);;
    console.log('user', users, '\n cap', captins)

    return {
      data: {...captins},
      type: 'passenger'
    };
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
  inLine,
  getUser
};