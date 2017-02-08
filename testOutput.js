const http = require('http');
const path = require('path')
const express = require('express');
const socketio = require('socket.io');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var server = http.Server(app);
server.listen(process.env.PORT || 8081);

var io = socketio(server);
let all_text = "";

io.sockets.on('connection', function(socket) {
  socket.on('loaded', function(data) {
    if(data === 'load complete'){
      console.log('you can start');
      socket.emit('start', true);
    }
  });
  socket.on('final_result', function(data){
    console.log('確定したテキスト', data[0].word);
    console.log("---------------------------------------");

  });
  socket.on('interim_result', function(data){
    //console.log('途中経過', data);
  });
  socket.on('status', function(data){
    //console.log('状態', data);
  })
});
console.log('server listening...');
