window.onload = function(){
  var socket = io.connect();
  socket.emit('loaded', 'load complete');
};
