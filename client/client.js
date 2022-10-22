

// express stuff
const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const app = express()
const port = 4000

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public')); 
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({
  extended: true
})) // Used to parse form data

const { io } = require("socket.io-client");

const socket = io("http://127.0.0.1:3000", {
  reconnectionDelayMax: 10000,
});


app.get('/', (req, res) => {
  res.render('index')
})

app.post("/login", (req, res) => {
    let user = req.body.username
    console.log(user)  

    // client-side
    socket.emit("login", user);

    socket.on('login-succesful', () => {
        console.log('login succesful')
        res.render('chess')
    })
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

