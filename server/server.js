const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { instrument } = require("@socket.io/admin-ui")
const cors = require('cors');

const {beginNewGame,activeGames} = require('./games')

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


let newGameCounter = 0


app.use(
  cors({
    origin: ['https://admin.socket.io'],
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  })
);

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: ['https://admin.socket.io'], credentials: false },
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});



function canGameStart(socket) {
  if (loggedInUsers.length > 1) {
    let user1 = loggedInUsers.pop()
    let user2 = loggedInUsers.pop()

    user1.color = 'white'
    user2.color = 'black'

    let newGame = beginNewGame(newGameCounter,user1,user2)
    newGameCounter ++

    if (newGame) {
      let infoObject = {
        "player1": {"id": newGame.player1.userID,
                  "name": newGame.player1.userName,
                 "color": newGame.player1.color},
        "player2": {"id": newGame.player2.userID,
                  "name": newGame.player2.userName,
                 "color": newGame.player2.color},
                 "state": newGame.state,
      }

      io.sockets.emit('player-info', infoObject)
      io.sockets.emit('gameStart',newGame.state)

    }

    return newGame

  } else {
    return null
  }
}

app.get('/', (req, res) => {
  res.render('index')
})

let newUserName = null

app.post("/login", (req, res) => {
  newUserName = req.body.username
  res.render('chess',{'myUserName': newUserName})
  });


io.on("connection", (socket) => {
  console.log(socket.id,newUserName)

  newUser = createUser(newUserName,socket.id)
  loggedInUsers.push(newUser)

  let game = canGameStart()

    if (game) {
      console.log(game.state)
    }

  socket.on('updateState', (gameID,state) => {
    activeGames[gameID].setState = state
    console.log(state)
    io.sockets.emit('updateState', activeGames[gameID].getState)
  })
  
  socket.on('move',(gameID,cb) => {
    activeGames[gameID].toggleTurn()
    console.log(activeGames[gameID].getState)
    cb(activeGames[gameID].getState)
  })
  
  
});



instrument(io, { auth: false })

