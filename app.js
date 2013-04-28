var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {

  // when the client emits 'send_djembe', this listens and executes
  socket.on('send_djembe', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
//Komal_ the first string is username,Play is just the message you send to
//other system    
io.sockets.emit('update_djembe', "", "Play");
  });

   // when the client emits 'send_conga', this listens and executes
	socket.on('send_conga', function (data) {
	io.sockets.emit('update_conga', "", "Play");
   });

 
  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    // echo to client they've connected
//Deidre    
//socket.emit('updatechat', 'SERVER', 'you have connected');
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    // update the list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
//Deidre    
//socket.broadcast.emit('updatechat', 'SERVER', "" + ' has disconnected');
  });
});