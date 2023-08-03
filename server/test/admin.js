const arg1 = process.argv.slice(2)[0],
  io = require('socket.io-client'),
  ioClient = io('http://localhost:3086', {
    auth: {
      token: 'f55d2dc2-7f87-4259-8c6e-f2d16a33e5d7',
    },
  });

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

ioClient.connect();

ioClient.emit('get-rooms');

ioClient.on('room-update', (data) => {
  console.log(data);
});
