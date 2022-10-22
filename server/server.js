const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const {beginNewGame,activeGames,newGameCounter} = require('./games')

const {createUser,loggedInUsers} = require('./users')

const app = express();
const http = require('http');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


server.listen(3000, () => {
  console.log('listening on *:3000');
});



// server-side
io.on("connection", (socket) => {

  socket.on("login", (name) => {
    console.log(`New user login with name ${name} and ID ${socket.id}`)
    newUser = createUser(name,socket.id)

    if (newUser) {
      console.log('login succesful')
      socket.emit('login-succesful')
    }

    console.log(newUser)
  });


});


