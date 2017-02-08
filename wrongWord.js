const http = require('http');
const path = require('path')
const express = require('express');
const socketio = require('socket.io');
const analyze = require('./analyze');
const fs = require('fs');
let want_to_detect = process.env.WANT_TO_DETECT
//var session = require('express-session');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var server = http.Server(app);
server.listen(process.env.PORT || 8080);

const io = socketio(server);
let result = "";

io.sockets.on('connection', function(socket) {
  let count = 0;
  socket.on('loaded', function(data) {
    if(data === 'load complete'){
      console.log('you can start');
    }
  });
  console.log(want_to_detect);
  socket.on('final_result', function(data){
    count++;
    console.log('確定したテキスト', data[0].word + "," + count);
    if(data.word !== want_to_detect){
      fs.appendFileSync('./wrongData/' + want_to_detect + '.txt', (data[0].word + ',' + data[0].confidence).trim() + '\n', 'utf8');
    }
    /*analyze.voice_analyze(data).then(function(voice){
      result += voice;
      console.log("sVoice", result);
    });*/
  });
  socket.on('status', function(data){
    console.log('状態', data);
  });
});
console.log('server listening...');
