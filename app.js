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
let all_text = "";
let arr_all_text = [];

io.sockets.on('connection', function(socket) {
  socket.on('loaded', function(data) {
    if(data === 'load complete'){
      console.log('you can start');
      socket.emit('start', true);
    }
  });
  socket.on('final_result', function(data){
    let add_text = '';
    console.log('確定したテキスト', data);
    analyze.voice_analyze(data).then(function(outputs){
      if(!outputs.IsDefined){
        add_text = data[0].word;
        all_text += add_text;
        arr_all_text.push(add_text);
      }else{
        if(outputs.add_text === "削除"){
          let tmp = '';
          for(var i = 0; i < all_text.length - 1; i++){
            tmp += all_text[i];
          }
          all_text = tmp;
        }else if(outputs.add_text === "Ctrl+z"){
          arr_all_text.pop();
        }else{
          all_text += outputs.add_text;
          arr_all_text.push(outputs.add_text);
        }
      }
      console.log(all_text);
      console.log("---------------------------------------");
      console.log("現状の文章");
      console.log(arr_all_text.toString().replace(/,/g,''));
      console.log("---------------------------------------");
    });

  });
  socket.on('interim_result', function(data){
    console.log('途中経過', data);
  });
  socket.on('status', function(data){
    console.log('状態', data);
  })
});
console.log('server listening...');
