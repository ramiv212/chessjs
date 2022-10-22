const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const {beginNewGame,activeGames,newGameCounter} = require('./games')

const {createUser,loggedInUsers} = require('./users')

const app = express();
const http = require('http');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public')); 
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({
  extended: true
})) // Used to parse form data

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


server.listen(3000, () => {
  console.log('listening on *:3000');
});



function canGameStart(newUser) {
  // if there is one person already logged in, then pop that person out of the list
  // then take the newly logged in person and create a new game with the two
  if (loggedInUsers.length > 0) {
    let player1 = loggedInUsers.pop()
    let player2 = newUser

    beginNewGame(player1,player2)
    console.log(activeGames)

    io.to(player1.id).emit('join-game', {
      "ememyID": player2.id,
      "enemyName": player2.name
    })

    io.to(player1.id).emit('join-game', {
      "ememyID": player1.id,
      "enemyName": player1.name
    })

  } else {
    loggedInUsers.push(newUser)

  }
}



app.get('/', (req, res) => {
  res.render('index')
})

app.post("/login", (req, res) => {
  let userName = req.body.username
  res.render('chess')

    // server-side
  io.on("connection", (socket) => {
    console.log(socket.id)
    newUser = createUser(userName,socket.id)
    console.log(newUser)

    canGameStart(newUser)
    });

  });