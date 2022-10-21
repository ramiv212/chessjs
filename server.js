const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const {canGameBegin,activeGames,newGameCounter} = require('./games')

const {createUser,loggedInUsers} = require('./users')

const app = express();

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public')); 
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({
  extended: true
})) // Used to parse form data


app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.get("/", (req, res) => {
  res.render('index');
});

app.post("/login", (req, res) => {
  let user = req.body.username

  console.log(req.body)

  console.log(`New user logged in: ${user}`)
  createUser(user)

  // check if there are two users active. If so, 
  if (canGameBegin(loggedInUsers)) {
        res.render('chess', {'gameID' : newGameCounter } )
  }

  res.end()

});


app.get('/gameState/:id', (req,res) => {
    let gameID = req.params.id
    res.send(JSON.stringify(activeGames[gameID].state))
})


app.post('/gameState/:id', (req,res) => {
  let gameID = req.params.id
  console.log(req.body)

  activeGames[gameID].updateState(req.body)

  res.send(JSON.stringify(activeGames[gameID].state))
})