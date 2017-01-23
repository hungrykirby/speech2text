const http = require('http');
const path = require('path')
const express = require('express');
const socketio = require('socket.io');
const analyze = require('./analyze');
//var session = require('express-session');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var server = http.Server(app);
server.listen(process.env.PORT || 8080);

var io = socketio(server);
let result = "";

io.sockets.on('connection', function(socket) {
  socket.on('loaded', function(data) {
    if(data === 'load complete'){
      console.log('you can start');
    }
  });
  socket.on('finalText', function(data){
    console.log('確定したテキスト', data);
    analyze.voice_analyze(data).then(function(voice){
      result += voice;
      console.log("sVoice", result);
    });
  });
  socket.on('interimText', function(data){
    console.log('途中経過', data);
  });
  socket.on('status', function(data){
    console.log('状態', data);
  })
});
console.log('server listening...');
