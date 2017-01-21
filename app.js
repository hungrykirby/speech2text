var http = require('http');
var path = require('path')
var express = require('express');
var socketio = require('socket.io');
//var session = require('express-session');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var server = http.Server(app);
server.listen(process.env.PORT || 8080);
console.log('server listening...');
