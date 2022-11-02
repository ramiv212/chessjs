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
            "whitePawn1":   {name: 'pawn',   position: 48, dead: false, timesMoved: 0},
            "whitePawn2":   {name: 'pawn',   position: 49, dead: false, timesMoved: 0},
            "whitePawn3":   {name: 'pawn',   position: 50, dead: false, timesMoved: 0},
            "whitePawn4":   {name: 'pawn',   position: 51, dead: false, timesMoved: 0},
            "whitePawn5":   {name: 'pawn',   position: 52, dead: false, timesMoved: 0},
            "whitePawn6":   {name: 'pawn',   position: 53, dead: false, timesMoved: 0},
            "whitePawn7":   {name: 'pawn',   position: 54, dead: false, timesMoved: 0},
            "whitePawn8":   {name: 'pawn',   position: 55, dead: false, timesMoved: 0},
            "whiteRook1":   {name: 'rook',   position: 56, dead: false, timesMoved: 0},
            "whiteBishop1": {name: 'bishop', position: 57, dead: false, timesMoved: 0},
            "whiteKnight1": {name: 'knight', position: 58, dead: false, timesMoved: 0},
            "whiteQueen":   {name: 'queen',  position: 59, dead: false, timesMoved: 0},
            "whiteKing":    {name: 'king',   position: 60, dead: false, timesMoved: 0},
            "whiteKnight2": {name: 'knight', position: 61, dead: false, timesMoved: 0},
            "whiteBishop2": {name: 'bishop', position: 62, dead: false, timesMoved: 0},
            "whiteRook2":   {name: 'rook',   position: 63, dead: false, timesMoved: 0},
            "blackPawn3":   {name: 'pawn',   position: 8,  dead: false, timesMoved: 0},
            "blackPawn1":   {name: 'pawn',   position: 9,  dead: false, timesMoved: 0}, 
            "blackPawn2":   {name: 'pawn',   position: 10, dead: false, timesMoved: 0}, 
            "blackPawn4":   {name: 'pawn',   position: 11, dead: false, timesMoved: 0}, 
            "blackPawn5":   {name: 'pawn',   position: 12, dead: false, timesMoved: 0}, 
            "blackPawn6":   {name: 'pawn',   position: 13, dead: false, timesMoved: 0}, 
            "blackPawn7":   {name: 'pawn',   position: 14, dead: false, timesMoved: 0}, 
            "blackPawn8":   {name: 'pawn',   position: 15, dead: false, timesMoved: 0}, 
            "blackRook1":   {name: 'rook',   position: 0,  dead: false, timesMoved: 0}, 
            "blackBishop1": {name: 'bishop', position: 1,  dead: false, timesMoved: 0},
            "blackKnight1": {name: 'knight', position: 2,  dead: false, timesMoved: 0},
            "blackQueen":   {name: 'queen',  position: 3,  dead: false, timesMoved: 0},
            "blackKing":    {name: 'king',   position: 4,  dead: false, timesMoved: 0,check: false},
            "blackKnight2": {name: 'knight', position: 5,  dead: false, timesMoved: 0},
            "blackBishop2": {name: 'bishop', position: 6,  dead: false, timesMoved: 0},
            "blackRook2":   {name: 'rook',   position: 7,  dead: false, timesMoved: 0},
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