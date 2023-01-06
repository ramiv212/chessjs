const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { 
  v4: uuidv4,
} = require('uuid');

const cors = require('cors');

const {Game, waitingGames, activeGames} = require('./games')
const {User, waitingUsers, playingUsers, createUser} = require('./users')


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
const { clear } = require("console");
const io = new Server(server, {
  cors: { origin: ['https://admin.socket.io'], credentials: false },
});


server.listen(process.env.PORT || 3000, () => {
  console.log(`listening on *:${process.env.PORT || 3000}`);
});


app.get('/', (req, res) => {
  res.render('index')

})


app.post("/login", (req, res) => {
  
  let newUserName = req.body.username

  res.redirect(`/chess?username=${newUserName}&id=${uuidv4()}`)

});


app.get("/chess", (req,res) => {

  let userName = req.query.username
  let ID = req.query.id

  res.render('chess',{myUserName: userName, myID: ID})

})

function emitUpdatedState(game) {
  io.to(game.player1.userID).emit('updateState', game.getState)
  io.to(game.player2.userID).emit('updateState', game.getState)
}

io.on("connection", (socket) => {
  socket.emit('giveMeYourInfo')

  socket.on('playerInfo', (playerID,playerUsername) => {
    let newUser = new User(playerUsername,playerID)

    socket.join(playerID)

    waitingUsers.push(newUser)

    if (waitingUsers.length > 1 ) {

      let player1 = waitingUsers.pop()
      let player2 = waitingUsers.pop()
  
      let newGame = new Game(newGameCounter,player1,player2)
      activeGames.push(newGame)
      newGameCounter ++

      io.to(player1.userID).emit('player-info', newGame.infoObject)
      io.to(player2.userID).emit('player-info', newGame.infoObject)
  
      io.to(player1.userID).emit('game-start',newGame.getState)  
      io.to(player2.userID).emit('game-start',newGame.getState)  

    }

    socket.on('updateState', (gameID,state) => {
      let game = activeGames[gameID]
      game.setState = state

      emitUpdatedState(game)

    })
    
    socket.on('move',(gameID,cb) => {
      let game = activeGames[gameID]

      game.toggleTurn()
      cb(game.getState)
    })
  
    socket.on('kill',(killedPiece,gameID,cb) => {
      let game = activeGames[gameID]

      game.getState[killedPiece].dead = true

      io.to(game.player1.userID).emit('confirmKill',killedPiece)
      io.to(game.player2.userID).emit('confirmKill',killedPiece)
    })

    socket.on('kingInCheck', (name,gameID) => {
      let game = activeGames[gameID]
      game.getState[name].check = true
    })

    socket.on('kingNotInCheck', (gameID) => {
      let game = activeGames[gameID]
      game.getState.whiteKing.check = false
      game.getState.blackKing.check = false
    })

  })

    socket.on('convert', (piece,newName,gameID) => {
      let game = activeGames[gameID]

      game.getState[piece].name = newName
      
      emitUpdatedState(game)
    })


    socket.on('send-message', (msg,gameID) => {
      let game = activeGames[gameID]

      io.to(game.player1.userID).emit('broadcast-message', msg)
      io.to(game.player2.userID).emit('broadcast-message', msg)
    })

    socket.on('game-over', (gameID) => {
      let game = activeGames[gameID]

      game.restart()

      emitUpdatedState(game)
    })

});