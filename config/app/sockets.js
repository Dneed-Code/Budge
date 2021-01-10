/**
 * Temperature check for Socket.io
 * Will console log reflecting when a client connects
 */

module.exports = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log('A new user client has connected');
    });
};