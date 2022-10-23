let activeGames = []

class Game {
    constructor(gameID, player1, player2) {

        this.gameID = gameID

        this.player1 = player1
        this.player2 = player2

        this.state = {
            "whitePawn1":   {position: 48, dead: false},
            "whitePawn2":   {position: 49, dead: false},
            "whitePawn3":   {position: 50, dead: false},
            "whitePawn4":   {position: 51, dead: false},
            "whitePawn5":   {position: 52, dead: false},
            "whitePawn6":   {position: 53, dead: false},
            "whitePawn7":   {position: 54, dead: false},
            "whitePawn8":   {position: 55, dead: false},
            "whiteRook1":   {position: 56, dead: false},
            "whiteBishop1": {position: 57, dead: false},
            "whiteKnight1": {position: 58, dead: false},
            "whiteQueen":   {position: 59, dead: false},
            "whiteKing":    {position: 60, dead: false},
            "whiteKnight2": {position: 61, dead: false},
            "whiteBishop2": {position: 62, dead: false},
            "whiteRook2":   {position: 63, dead: false},
            "blackPawn3":   {position: 8,  dead: false},
            "blackPawn1":   {position: 9,  dead: false}, 
            "blackPawn2":   {position: 10, dead: false}, 
            "blackPawn4":   {position: 11, dead: false}, 
            "blackPawn5":   {position: 12, dead: false}, 
            "blackPawn6":   {position: 13, dead: false}, 
            "blackPawn7":   {position: 14, dead: false}, 
            "blackPawn8":   {position: 15, dead: false}, 
            "blackRook1":   {position: 0,  dead: false}, 
            "blackBishop1": {position: 1,  dead: false},
            "blackKnight1": {position: 2,  dead: false},
            "blackQueen":   {position: 3,  dead: false},
            "blackKing":    {position: 4,  dead: false},
            "blackKnight2": {position: 5,  dead: false},
            "blackBishop2": {position: 6,  dead: false},
            "blackRook2":   {position: 7,  dead: false},
            "player1id":      {id: player1},
            "player2id":      {id: player1},
            "whiteTurn":    true,
            "gameID":       gameID
        }
    }
    
    set setState(newState) {
        this.state = newState
    }

    get getState() {
        return this.state
    }

    toggleTurn() {
        this.state.whiteTurn = (!(this.state.whiteTurn))
    }
}


// check if there are two active users to start a game
function beginNewGame(newGameCounter,player1,player2) {
    let newGame = new Game(newGameCounter,player1,player2)
    activeGames.push(newGame)

    return newGame
}


module.exports = {beginNewGame, activeGames}