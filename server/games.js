const {createUser,loggedInUsers} = require('./users')

let waitingGames = []
let activeGames = []

class Game {
    constructor(newGameCounter,player1,player2) {

        this.gameID = newGameCounter

        this.player1 = player1
        this.player2 = player2

        this.infoObject = {
            "player1": {"id": player1.userID,
                      "name": player1.userName,
                     "color": 'white'},
            "player2": {"id": player2.userID,
                      "name": player2.userName,
                     "color": 'black'},
          }

        this.state = {
            "whitePawn1":   {position: 48, dead: false, timesMoved: 0},
            "whitePawn2":   {position: 49, dead: false, timesMoved: 0},
            "whitePawn3":   {position: 50, dead: false, timesMoved: 0},
            "whitePawn4":   {position: 51, dead: false, timesMoved: 0},
            "whitePawn5":   {position: 52, dead: false, timesMoved: 0},
            "whitePawn6":   {position: 53, dead: false, timesMoved: 0},
            "whitePawn7":   {position: 54, dead: false, timesMoved: 0},
            "whitePawn8":   {position: 55, dead: false, timesMoved: 0},
            "whiteRook1":   {position: 56, dead: false, timesMoved: 0},
            "whiteBishop1": {position: 57, dead: false, timesMoved: 0},
            "whiteKnight1": {position: 58, dead: false, timesMoved: 0},
            "whiteQueen":   {position: 59, dead: false, timesMoved: 0},
            "whiteKing":    {position: 60, dead: false, timesMoved: 0},
            "whiteKnight2": {position: 61, dead: false, timesMoved: 0},
            "whiteBishop2": {position: 62, dead: false, timesMoved: 0},
            "whiteRook2":   {position: 63, dead: false, timesMoved: 0},
            "blackPawn3":   {position: 8,  dead: false, timesMoved: 0},
            "blackPawn1":   {position: 9,  dead: false, timesMoved: 0}, 
            "blackPawn2":   {position: 10, dead: false, timesMoved: 0}, 
            "blackPawn4":   {position: 11, dead: false, timesMoved: 0}, 
            "blackPawn5":   {position: 12, dead: false, timesMoved: 0}, 
            "blackPawn6":   {position: 13, dead: false, timesMoved: 0}, 
            "blackPawn7":   {position: 14, dead: false, timesMoved: 0}, 
            "blackPawn8":   {position: 15, dead: false, timesMoved: 0}, 
            "blackRook1":   {position: 0,  dead: false, timesMoved: 0}, 
            "blackBishop1": {position: 1,  dead: false, timesMoved: 0},
            "blackKnight1": {position: 2,  dead: false, timesMoved: 0},
            "blackQueen":   {position: 3,  dead: false, timesMoved: 0},
            "blackKing":    {position: 4,  dead: false, timesMoved: 0},
            "blackKnight2": {position: 5,  dead: false, timesMoved: 0},
            "blackBishop2": {position: 6,  dead: false, timesMoved: 0},
            "blackRook2":   {position: 7,  dead: false, timesMoved: 0},
            "player1id":    null,
            "player2id":    null,
            "whiteTurn":    true,
            "gameID":       this.gameID
        }

    }
    
    set setState(newState) {
        this.state = newState
    }

    get getState() {
        return this.state
    }

    addPlayer1(player1) {
        this.player1 = player1
    }

    addPlayer(player2) {
        this.player2 = player2
    }

    toggleTurn() {
        this.state.whiteTurn = (!(this.state.whiteTurn))
    }
}

module.exports = {Game, waitingGames, activeGames}