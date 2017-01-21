var http = require('http');
var path = require('path')
var express = require('express');
var socketio = require('socket.io');
//var session = require('express-session');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var server = http.Server(app);
server.listen(process.env.PORT || 8080);

var io = socketio(server);

io.sockets.on('connection', function(socket) {
  socket.on('loaded', function(data) {
    if(data === 'load complete'){
      console.log('you can start');
    }
  });
  socket.on('finalText', function(data){
    console.log('f', data);
  });
  socket.on('interimText', function(data){
    console.log('i', data);
  });
  socket.on('status', function(data){
    console.log('s', data);
  })
});
console.log('server listening...');
