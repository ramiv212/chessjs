const app = document.getElementById('app')

// dialog box for upgrading pawn
const waitingForPlayerOverlay = document.getElementById('waiting-for-player')
const dialogBox = document.getElementById('pawnUpdate');
const selectEl = dialogBox.querySelector('select');
const confirmBtn = dialogBox.querySelector('#confirmBtn');

const playerOneTurnDisplay = document.getElementById('player-one-turn')
const playerTwoTurnDisplay = document.getElementById('player-two-turn')

const deadWhitePiecesDiv = document.getElementById('dead-white-pieces')
const deadBlackPiecesDiv = document.getElementById('dead-black-pieces')

const chatBox = document.getElementById('chat-box')
const chatInput = document.getElementById('chat-input')
const chatButton = document.getElementById('chat-button')

let playerInfo = null

const spotList = []
let pieceList = []

let whiteTurn = true

let amIwhite = null

let gameID = null

let gameCounter = 1


function checkWhoStarts(info) {
    //  check if current player is player one (white)
    if (gameCounter % 2 !== 0 && myUserName === info.player1.name) {
        amIwhite = true
    } else if (gameCounter % 2 === 0 && myUserName === info.player2.name) {
        amIwhite = true
    } else {
        amIwhite = false
    }
    
    if (info !== null && gameCounter % 2 !== 0) {
        document.getElementById('player-one-name').innerText = info.player1.name
        document.getElementById('player-two-name').innerText = info.player2.name
    } else if(info !== null && gameCounter % 2 === 0) {
        document.getElementById('player-one-name').innerText = info.player2.name
        document.getElementById('player-two-name').innerText = info.player1.name
    }
}


socket.on('player-info',(info) => {

    if (info !== null && gameCounter % 2 !== 0) {
        document.getElementById('player-one-name').innerText = info.player1.name
        document.getElementById('player-two-name').innerText = info.player2.name
    } else if(info !== null && gameCounter % 2 === 0) {
        document.getElementById('player-one-name').innerText = info.player2.name
        document.getElementById('player-two-name').innerText = info.player1.name
    }

    playerInfo = info
    checkWhoStarts(info)

})


function initPieces (state) {
    removeAllPieces()
    pieceList = []

    // init white pawns
    let whitePawn1 = new Piece('white', state.whitePawn1.name, 'whitePawn1', spotList[state.whitePawn1.position],0,state.whitePawn1.dead, state.whitePawn1.timesMoved)
    let whitePawn2 = new Piece('white', state.whitePawn2.name, 'whitePawn2', spotList[state.whitePawn2.position],1,state.whitePawn2.dead, state.whitePawn2.timesMoved)
    let whitePawn3 = new Piece('white', state.whitePawn3.name, 'whitePawn3', spotList[state.whitePawn3.position],2,state.whitePawn3.dead, state.whitePawn3.timesMoved)
    let whitePawn4 = new Piece('white', state.whitePawn4.name, 'whitePawn4', spotList[state.whitePawn4.position],3,state.whitePawn4.dead, state.whitePawn4.timesMoved)
    let whitePawn5 = new Piece('white', state.whitePawn5.name, 'whitePawn5', spotList[state.whitePawn5.position],4,state.whitePawn5.dead, state.whitePawn5.timesMoved)
    let whitePawn6 = new Piece('white', state.whitePawn6.name, 'whitePawn6', spotList[state.whitePawn6.position],5,state.whitePawn6.dead, state.whitePawn6.timesMoved)
    let whitePawn7 = new Piece('white', state.whitePawn7.name, 'whitePawn7', spotList[state.whitePawn7.position],6,state.whitePawn7.dead, state.whitePawn7.timesMoved)
    let whitePawn8 = new Piece('white', state.whitePawn8.name, 'whitePawn8', spotList[state.whitePawn8.position],7,state.whitePawn8.dead, state.whitePawn8.timesMoved)

    // init white specials
    let whiteRook1 = new Piece('white',   state.whiteRook1.name,     'whiteRook1',  spotList[state.whiteRook1.position],8,    state.whiteRook1.dead  , state.whiteRook1.timesMoved)
    let whiteBishop1 = new Piece('white', state.whiteBishop1.name, 'whiteBishop1',  spotList[state.whiteBishop1.position],9,  state.whiteBishop1.dead, state.whiteBishop1.timesMoved)
    let whiteKnight1 = new Piece('white', state.whiteKnight1.name, 'whiteKnight1',  spotList[state.whiteKnight1.position],10, state.whiteKnight1.dead, state.whiteKnight1.timesMoved)
    let whiteQueen = new Piece('white',   state.whiteQueen.name,    'whiteQueen',   spotList[state.whiteQueen.position],11,   state.whiteQueen.dead  , state.whiteQueen.timesMoved)
    let whiteKnight2 = new Piece('white', state.whiteKnight2.name, 'whiteKnight2',  spotList[state.whiteKnight2.position],13, state.whiteKnight2.dead, state.whiteKnight2.timesMoved)
    let whiteBishop2 = new Piece('white', state.whiteBishop2.name, 'whiteBishop2',  spotList[state.whiteBishop2.position],14, state.whiteBishop2.dead, state.whiteBishop2.timesMoved)
    let whiteRook2 = new Piece('white',   state.whiteRook2.name,     'whiteRook2',  spotList[state.whiteRook2.position],15,   state.whiteRook2.dead  , state.whiteRook2.timesMoved)



    // init black pawns
    let blackPawn1 = new Piece('black', state.blackPawn1.name, 'blackPawn1', spotList[state.blackPawn1.position],16, state.blackPawn1.dead, state.blackPawn1.timesMoved)
    let blackPawn2 = new Piece('black', state.blackPawn2.name, 'blackPawn2', spotList[state.blackPawn2.position],17, state.blackPawn2.dead, state.blackPawn2.timesMoved)
    let blackPawn3 = new Piece('black', state.blackPawn3.name, 'blackPawn3', spotList[state.blackPawn3.position],18, state.blackPawn3.dead, state.blackPawn3.timesMoved)
    let blackPawn4 = new Piece('black', state.blackPawn4.name, 'blackPawn4', spotList[state.blackPawn4.position],19, state.blackPawn4.dead, state.blackPawn4.timesMoved)
    let blackPawn5 = new Piece('black', state.blackPawn5.name, 'blackPawn5', spotList[state.blackPawn5.position],20, state.blackPawn5.dead, state.blackPawn5.timesMoved)
    let blackPawn6 = new Piece('black', state.blackPawn6.name, 'blackPawn6', spotList[state.blackPawn6.position],21, state.blackPawn6.dead, state.blackPawn6.timesMoved)
    let blackPawn7 = new Piece('black', state.blackPawn7.name, 'blackPawn7', spotList[state.blackPawn7.position],22, state.blackPawn7.dead, state.blackPawn7.timesMoved)
    let blackPawn8 = new Piece('black', state.blackPawn8.name, 'blackPawn8', spotList[state.blackPawn8.position],23, state.blackPawn8.dead, state.blackPawn8.timesMoved)

    // init black specials
    let blackRook1 = new Piece('black',   state.blackRook1.name,   'blackRook1',   spotList[state.blackRook1.position],24,    state.blackRook1.dead  , state.whiteRook1.timesMoved)
    let blackBishop1 = new Piece('black', state.blackBishop1.name, 'blackBishop1', spotList[state.blackBishop1.position],25,  state.blackBishop1.dead, state.whiteBishop1.timesMoved)
    let blackKnight1 = new Piece('black', state.blackKnight1.name, 'blackKnight1', spotList[state.blackKnight1.position],26,  state.blackKnight1.dead, state.whiteKnight1.timesMoved)
    let blackQueen = new Piece('black',   state.blackQueen.name,   'blackQueen',   spotList[state.blackQueen.position],27,    state.blackQueen.dead  , state.whiteQueen.timesMoved)
    let blackKnight2 = new Piece('black', state.blackKnight2.name, 'blackKnight2', spotList[state.blackKnight2.position],29,  state.blackKnight2.dead, state.whiteKnight2.timesMoved)
    let blackBishop2 = new Piece('black', state.blackBishop2.name, 'blackBishop2', spotList[state.blackBishop2.position],30,  state.blackBishop2.dead, state.whiteBishop2.timesMoved)
    let blackRook2 = new Piece('black',   state.blackRook2.name,   'blackRook2',   spotList[state.blackRook2.position],31,    state.blackRook2.dead  , state.whiteRook2.timesMoved)

    let whiteKing = new Piece('white',    state.whiteKing.name,      'whiteKing',   spotList[state.whiteKing.position],12,    state.whiteKing.dead   , state.whiteKing.timesMoved)
    let blackKing = new Piece('black',    state.blackKing.name,    'blackKing',    spotList[state.blackKing.position],28,     state.blackKing.dead   , state.whiteKing.timesMoved)


    let piecesToInit = [whitePawn1,whitePawn2,whitePawn3,whitePawn4,whitePawn5,whitePawn6,whitePawn7,whitePawn8,
        whiteRook1,whiteBishop1,whiteKnight1,whiteQueen,whiteKing,whiteKnight2,whiteBishop2,whiteRook2,
        blackPawn1,blackPawn2,blackPawn3,blackPawn4,blackPawn5,blackPawn6,blackPawn7,blackPawn8,
        blackRook1,blackBishop1,blackKnight1,blackQueen,blackKing,blackKnight2,blackBishop2,blackRook2]
    

    spotList.forEach(spot => {
        spot.blocked = false
    })


    // remove the dead pieces from every init of pieces
    piecesToInit.forEach((piece) => {
        if (piece.dead) {
            piece.pieceDiv.parentElement.remove()
        } else {
            pieceList.push(piece)
            piece.currentSpot.blocked = true
        }
    })
    
    whiteTurn = state.whiteTurn

    gameID = state.gameID


    // check "check" state
    whiteKing.setCheck(state.whiteKing.check)
    blackKing.setCheck(state.blackKing.check)


    // convert pawn logic?
    for (let index = 0;index < pieceList.length; index++) {
        if (pieceList[index].name === 'pawn') {
            pieceList[index].convertPawnLogic()
        }
    }

    toggleTurn(state.whiteTurn)

}


// this set is used to check if any kings are in check
let checkKillList = new Set([])

let selectedPiece = null
let moveBeingPicked = false

// check if window is resized
window.addEventListener('resize', (e) => {
    pieceList.forEach(element => {
        element.repositionPieces()
    });
})

// create a div for the board
const boardDiv = document.createElement('div');
app.appendChild(boardDiv);
boardDiv.id = 'board-div';


// game functions

function toggleTurn(isWhite) {
    if (isWhite) {
        pieceList.forEach(piece => {
            if(piece.color === "white") {
                checkKillList.clear()

                piece.turn = true
            } else {
                piece.turn = false

            }
        });

        playerOneTurnDisplay.innerHTML = "- Your Turn"
        playerTwoTurnDisplay.innerHTML = "<br>"


    } else {
        pieceList.forEach(piece => {
            if(piece.color === "black") {
                checkKillList.clear()
                piece.turn = true
            } else {
                piece.turn = false

            }
        });

        playerOneTurnDisplay.innerHTML = "<br>"
        playerTwoTurnDisplay.innerHTML = "- Your Turn"

    }
}

function clearKillSpots() {
    spotList.forEach(element => {
        if (element.spotDiv.childNodes) {
            let children = Array.from(element.spotDiv.childNodes)
            killSpots = children.slice(0)
            if (killSpots) {
                killSpots.forEach(element => {
                    element.remove()
                });
            }
        }
    })  
}

function clearPotentialMovesInBoard() {
    spotList.forEach(element => {
        if (element.spotDiv.childNodes[0]) {
            element.spotDiv.childNodes[0].remove()
        }
    })
}

function clearSelected() {
    pieceList.forEach(element => {
        element.selected = false
        element.pieceDiv.className = "";
    });
    clearPotentialMovesInBoard()
    clearKillSpots()
    
}

function returnSpotFromCoords(x,y) {
    let filtered = spotList.filter(
        (spot) => {
            if (spot.xIndex === x && spot.yIndex === y) {
                return spot
            }
        }
    )
    return filtered[0]
}

function returnCoordsFromSpot(spot) {
    return {
        'x': spot.xIndex,
        'y': spot.yIndex,
    }
}

function isSpotBlocked(spot) {
    if(spot.blocked === true) {
        return true
    } else {
        return false
    }
}

function getPieceFromSpot(spot) {
    let spotTop = spot.position.top
    let spotLeft = spot.position.left

    let pieceFromSpot = pieceList.filter(
        (piece) => {
            return (piece.currentSpot.position.top === spotTop && piece.currentSpot.position.left === spotLeft)
        }
    ) 
    return pieceFromSpot[0]
}


function blockHoverForAllOtherSpots(piece) {
    pieceList.forEach(element => {
        if (element !== piece) {
            element.canHighlight = false
        }
    })
}

function blockAllPiecesDuringCheck(king) {
    pieceList.forEach(piece => {
        if (piece !== king && piece !== undefined && piece.color === king.color) {
            piece.canHighlight = false
        }
    })
}


function unBlockHoverForAllOtherSpots() {
    pieceList.forEach(element => {
            element.canHighlight = true;
    })
}

function showBlockStatus() {
    // show block status
    for (let index = 0; index < spotList.length; index++) {
        let spot = spotList[index]
        spot.spotDiv.innerText = spot.blocked
    }
}

function removeDeadPiece (deadPiece) {
    deadPiece.pieceDiv.style.width = '40px'
    deadPiece.pieceDiv.style.height = '40px'
    deadPiece.pieceDiv.style.backgroundSize = 'cover'

    deadPiece.pieceDiv.parentElement.remove()

    deadPiece.dead = true

    if (deadPiece.color === 'white') {
        deadWhitePiecesDiv.appendChild(deadPiece.pieceDiv)

    } else {
        deadBlackPiecesDiv.appendChild(deadPiece.pieceDiv)
    }


}

function removeAllPieces() {
    // remove all pieces from the board
    pieceList.forEach(piece => {
        piece.pieceDiv.parentElement.remove()
    })
}


function gameOver(color) {
    
    if (color === 'black') {
        alert('White wins!')
    } else {
        alert('Black Wins!')
    }

    // remove pieces from dead areas
    deadBlackPiecesDiv.innerHTML = ""
    deadWhitePiecesDiv.innerHTML = ""

    spotList.forEach(spot => {
        spot.spotDiv.style.backgroundColor = "";
    })

    socket.emit('game-over', gameID)
    gameCounter ++
    checkWhoStarts(playerInfo)
}


// returns false if none of the kings are in check. If one of them is in check it returns true.
// this is used to check if the purple background can be removed (once king is no longer in check)
// if turns the checkkilllist into an array, and filters out any pieces that are king if there are any.
function isKingInCheck() {
    result = Array.from(checkKillList).filter((piece) => {
        if (getPieceFromSpot(piece) && getPieceFromSpot(piece).name === "king") {
        return piece
        }
    })
    
    if (result.length === 0) {
        return false
    } else {
        return true
    }
}

class Piece {
    constructor(color,name,camelCaseName,currentSpot,index,dead,timesMoved) {
        this.color = color;
        this.name = name;
        this.camelCaseName = camelCaseName;
        this.selected = false;
        this.index = index
        this.currentSpot = currentSpot
        this.possibleMoves = []
        this.killMoves = new Set([])
        this.canHighlight = true
        this.timesMoved = timesMoved
        this.turn = false
        this.dead = dead
        this.check = false

        // create div and container div for piece
        this.pieceDiv = document.createElement('div')
        this.containerDiv = document.createElement('div')

        // append div to container div and container div to main div
        this.containerDiv.appendChild(this.pieceDiv)
        app.appendChild(this.containerDiv)

        // set ID of div to color + name and container for that div
        this.pieceDiv.id = color + name
        this.containerDiv.id = color + name + 'container'

        // position piece via x and y coords
        this.containerDiv.style.top = this.currentSpot.position.top + 'px';
        this.containerDiv.style.left = this.currentSpot.position.left + 'px'

        // select piece when clicked on
        this.pieceDiv.onclick = () => (this.select())

        // update possible moves
        this.updatePossibleMoves()

        // show possible moves on hover
        this.pieceDiv.addEventListener('mouseover', (event) => {
            this.updatePossibleMoves()
            this.highlightPossibleMoves()
        })

        // when mouse leaves pieceDiv, change possible move backgroundColors back to none
        this.pieceDiv.addEventListener('mouseleave', (event) => {
            this.unHighlightPossibleMoves()
        })
    }

    repositionPieces() {
        this.containerDiv.style.top = this.currentSpot.position.top + 'px';
        this.containerDiv.style.left = this.currentSpot.position.left + 'px'
    }

    highlightPossibleMoves() {
        // highlight possible moves on hover
        if (moveBeingPicked === false && this.dead === false) {
            this.possibleMoves.forEach(element => {
                element.spotDiv.style.backgroundColor = 'yellow'
            });
        }
    }   

    unHighlightPossibleMoves() {
            // only un-highlight if piece is not selected
            if (this.selected === false && moveBeingPicked === false){
                this.possibleMoves.forEach(element => {
                    element.spotDiv.style.backgroundColor = ""
            })
            self.clearKillSpots()
            this.killMoves = new Set([])
        }
    }

    convertPawnLogic() {
        if ((this.currentSpot.xIndex === 7 && this.name === 'pawn' && this.color === 'black' && amIwhite === false) || (this.currentSpot.xIndex === 0 && this.name === 'pawn' && this.color === 'white' && amIwhite === true)) {
            // convert piece logic
            dialogBox.showModal()

            confirmBtn.onclick = () => {
                this.name = selectEl.value.toLowerCase()
                // this.pieceDiv.style.backgroundImage = "url('images/" + this.color + this.name + ".png')"

                socket.emit('convert', this.camelCaseName, selectEl.value.toLowerCase(), gameID)
            }
        }
    }

    updatePossibleMoves() {
        // black pawn logic
        if(this.name === 'pawn' && this.color ==='black' && this.canHighlight) {
            this.possibleMoves = [];

            this.nextMoveSpot = spotList[this.currentSpot.index + 8]
            
            if (this.nextMoveSpot === undefined) {
                // do nothing
            } else if (this.timesMoved < 1 && this.nextMoveSpot.blocked === false) {
                this.possibleMoves.push(spotList[this.currentSpot.index + 16])
                this.possibleMoves.push(spotList[this.currentSpot.index + 8])
            } else if (this.timesMoved > 0 && this.nextMoveSpot.blocked === false){
                this.possibleMoves.push(spotList[this.currentSpot.index + 8])
            }
    
            if (this.nextMoveSpot !== undefined) {
                // kill logic
                let killMoveLeft = returnSpotFromCoords(this.nextMoveSpot.xIndex,this.nextMoveSpot.yIndex -1)
                let killMoveRight = returnSpotFromCoords(this.nextMoveSpot.xIndex,this.nextMoveSpot.yIndex + 1)

                let pawnKillMoves = [killMoveLeft,killMoveRight]
        
                pawnKillMoves.forEach(element => {
                    if (element && getPieceFromSpot(element) && getPieceFromSpot(element).color !== this.color) {
                        this.killMoves.add(element)
                    }
                })
                this.killLogic(this.killMoves)
            }
        }

        // white pawn logic
        if(this.name === 'pawn' && this.color ==='white' && this.canHighlight) {
            this.possibleMoves = [];

            this.nextMoveSpot = spotList[this.currentSpot.index - 8]
            
            if (this.nextMoveSpot === undefined) {
                // do nothing
            } else if (this.timesMoved < 1 && this.nextMoveSpot.blocked === false) {
                this.possibleMoves.push(spotList[this.currentSpot.index - 16])
                this.possibleMoves.push(spotList[this.currentSpot.index - 8])
            } else if (this.timesMoved > 0 && this.nextMoveSpot.blocked === false){
                this.possibleMoves.push(spotList[this.currentSpot.index - 8])
            }
    
            if (this.nextMoveSpot !== undefined) {
                // kill logic
                let killMoveLeft = returnSpotFromCoords(this.nextMoveSpot.xIndex,this.nextMoveSpot.yIndex -1)
                let killMoveRight = returnSpotFromCoords(this.nextMoveSpot.xIndex,this.nextMoveSpot.yIndex + 1)

                let pawnKillMoves = [killMoveLeft,killMoveRight]
        
                pawnKillMoves.forEach(element => {
                    if (element && getPieceFromSpot(element) && getPieceFromSpot(element).color !== this.color) {
                        this.killMoves.add(element)
                    }
                })
                this.killLogic(this.killMoves)
            }
        }
        
        // rook logic
        else if(this.name === 'rook' && this.canHighlight) {
            this.possibleMoves = this.rookLogic()
        }

        else if(this.name === 'bishop' && this.canHighlight) {
            let upLeft = this.bishopLogic(this.xIndex,this.yIndex,-1,-1,0,0) // up left
            let downRight = this.bishopLogic(this.xIndex,this.yIndex,1,1,7,7) // down right
            let upRight = this.bishopLogic(this.xIndex,this.yIndex,-1,1,0,7) // up right
            let downLeft = this.bishopLogic(this.xIndex,this.yIndex,1,-1,7,0) // down left

            this.possibleMoves = [...upLeft,...downRight,...upRight,...downLeft]
        }

        else if (this.name === 'knight' && this.canHighlight) {
            let down = this.knightLogic(2,1)
            let up = this.knightLogic(-2,1)
            let right = this.knightLogic(1,2)
            let left = this.knightLogic(-1,2)


            this.possibleMoves = [...down,...up,...right,...left]
        }

        else if (this.name === 'king' && this.canHighlight) {

            this.possibleMoves = this.kingLogic()
        }

        else if (this.name === 'queen' && this.canHighlight) {

            let upLeft = this.bishopLogic(this.xIndex,this.yIndex,-1,-1,0,0) // up left
            let downRight = this.bishopLogic(this.xIndex,this.yIndex,1,1,7,7) // down right
            let upRight = this.bishopLogic(this.xIndex,this.yIndex,-1,1,0,7) // up right
            let downLeft = this.bishopLogic(this.xIndex,this.yIndex,1,-1,7,0) // down left

            let perpendiculars = this.rookLogic()

            this.possibleMoves = [...upLeft,...downRight,...upRight,...downLeft,...perpendiculars]
        }

    }

    select() {

        if (amIwhite && whiteTurn && this.color === 'white' || (!amIwhite) && (!whiteTurn) && this.color === 'black') {
            clearSelected()
            this.killMoves = new Set([])
            
            unBlockHoverForAllOtherSpots()
            blockHoverForAllOtherSpots(this)
            
            spotList.forEach(element => {
                element.spotDiv.style.backgroundColor = ""
            });
            
            this.selected = true
            if (this.selected === true) {
                this.pieceDiv.className = 'selected'
                selectedPiece = this
            }
            this.updatePossibleMoves()

            this.possibleMoves.forEach(element => {
                let newSpotButton = document.createElement('button')
                newSpotButton.className = "new-spot-button"
                newSpotButton.style.width = '100px;'
                newSpotButton.onclick = () => (this.pickSpot(element.index))
                element.spotDiv.appendChild(newSpotButton)
            });

            moveBeingPicked = true
        }
    }

    pickSpot(index) {

        selectedPiece.selected = false

        // remove event listeners from possible spots of selected piece
        selectedPiece.possibleMoves.forEach(element => {
            element.spotDiv.style.backgroundColor = ""
        });

        // update the selected piece currentSpot to newly picked spot
        selectedPiece.currentSpot = spotList[index]

        // position piece via x and y coords
        selectedPiece.containerDiv.style.top = selectedPiece.currentSpot.position.top + 'px';
        selectedPiece.containerDiv.style.left = selectedPiece.currentSpot.position.left + 'px'

        moveBeingPicked = false
        selectedPiece.pieceDiv.className = ""

        pieceList.forEach(element => {
            element.updatePossibleMoves()
        });

        clearPotentialMovesInBoard()
        // clear Killmoves set
        this.killMoves = new Set([])
        clearKillSpots()

        unBlockHoverForAllOtherSpots()

        // this is to check if pawns can move double initially
        // this.timesMoved ++

        socket.emit('move', gameID ,state => {
            let movedPiece = state[selectedPiece.camelCaseName]
            movedPiece.position = index
            movedPiece.timesMoved ++
            
            socket.emit('updateState',gameID,state)
            
        })
    }

    rookLogic() {
        let possibleMoves = []

        let count = 0

        let loop = true

        // x1 and y1 equal the x and y index of the spot that the piece is currently in
        let x1 = this.currentSpot.xIndex
        let y1 = this.currentSpot.yIndex

        // this is the spot that was just evaluated
        let currentX = x1
        let currentY = y1

        let upTimes = x1
        let rightTimes = 7 - y1
        let leftTimes = y1
        let downTimes = 7 - x1

        // add up spots
        while (count !== upTimes && loop) {
            count ++

           let nextMove = spotList.filter(
                (spot) => {
                    return (spot.xIndex === currentX -1 && spot.yIndex === currentY)
                }
            )
            if (nextMove[0].blocked === false) {
                possibleMoves.push(nextMove[0])
            } else {
                // check if next move is kill move
                if(getPieceFromSpot(nextMove[0]) && getPieceFromSpot(nextMove[0]).color !== this.color) {
                    this.killMoves.add(nextMove[0])
                }

                loop = false
            }
            currentX --
        }

        
        // add down spots
        count = 0
        currentX = x1
        currentY = y1
        loop = true

        while (count !== downTimes && loop) {
            
            count ++

           let nextMove = spotList.filter(
                (spot) => {
                    return (spot.xIndex === currentX + 1 && spot.yIndex === currentY)
                }
            )
            
            if (nextMove[0].blocked === false) {
                possibleMoves.push(nextMove[0])
            } else {
                // check if next move is kill move
                if(getPieceFromSpot(nextMove[0]) && getPieceFromSpot(nextMove[0]).color !== this.color) {
                    this.killMoves.add(nextMove[0])
                }

                loop = false
            }
            currentX ++
        }


        // add left spots
        count = 0
        currentX = x1
        currentY = y1
        loop = true

        while (count !== leftTimes && loop) {
            count ++

           let nextMove = spotList.filter(
                (spot) => {
                    return (spot.xIndex === currentX && spot.yIndex === currentY - 1)
                }
            )
            if (nextMove[0].blocked === false) {
                possibleMoves.push(nextMove[0])
            } else {
                // check if next move is kill move
                if(getPieceFromSpot(nextMove[0]) && getPieceFromSpot(nextMove[0]).color !== this.color) {
                    this.killMoves.add(nextMove[0])
                }

                loop = false
            }
            currentY --
        }


        // add right spots
        count = 0
        currentX = x1
        currentY = y1
        loop = true

        while (count !== rightTimes && loop) {
            count ++

           let nextMove = spotList.filter(
                (spot) => {
                    return (spot.xIndex === currentX && spot.yIndex === currentY + 1)
                }
            )
            
            this.bishopPieceToKillLogic(nextMove[0])

            if (nextMove[0].blocked === false) {
                possibleMoves.push(nextMove[0])
            } else {
                // check if next move is kill move
                if(getPieceFromSpot(nextMove[0]) && getPieceFromSpot(nextMove[0]).color !== this.color) {
                    this.killMoves.add(nextMove[0])
                }

                loop = false
            }
            currentY ++
        }

        this.killLogic(this.killMoves)
        return possibleMoves
    }

    bishopPieceToKillLogic(nextX,nextY){
        // bishop piece to kill logic
        if (nextX && nextY && returnSpotFromCoords(nextX,nextY)) {
            let nextPiece = getPieceFromSpot(returnSpotFromCoords(nextX,nextY))
                if (nextPiece !== undefined && nextPiece.color !== this.color) {
                    this.killMoves.add(nextPiece.currentSpot)
                }
        }
    }

    bishopLogic(x2,y2,directionX,directionY,limitX,limitY) {

        let possibleMoves = []

        // x1 and y1 equal the x and y index of the spot that the piece is currently in
        let x1 = this.currentSpot.xIndex
        let y1 = this.currentSpot.yIndex

        // this is the spot that was just evaluated
        let currentX = x1
        let currentY = y1

        // this is the next spot being evaluated. The direction is determined on a positive or negative number.
        let nextX = currentX + directionX
        let nextY = currentY + directionY

        let loop = true

        // loop that stops once the x coord reaches a number that is one more or less than the last number.
        // also stops if the next spot being checked is blocked.
        while (loop){

            if (nextX != limitX + directionX && nextY != limitY + directionY && returnSpotFromCoords(nextX,nextY).blocked === false) {
                // loop through all the spots and add the ones that match the next x and y criteria to the possible moves list
                spotList.forEach(element => {
                    if (element.xIndex == nextX && element.yIndex == nextY) {
                        possibleMoves.push(element)
                    }
                });

                // set the next spot as the current spot
                currentX = nextX
                currentY = nextY

                // make next spot being evaluated the current spot plus or minus the direction number (depending on direction) and rinse and repeat the loop
                nextX = currentX + directionX
                nextY = currentY + directionY

            } else {

                if (returnSpotFromCoords(nextX,nextY) && getPieceFromSpot(returnSpotFromCoords(nextX,nextY)) && getPieceFromSpot(returnSpotFromCoords(nextX,nextY)).color !== this.color) {
                    this.killMoves.add(returnSpotFromCoords(nextX,nextY))
                }

                this.killLogic(this.killMoves)
                loop = false
                return possibleMoves
            }
        }
    }

        knightLogic (directionX,directionY) {

            // x1 and y1 equal the x and y index of the spot that the piece is currently in
            let x1 = this.currentSpot.xIndex
            let y1 = this.currentSpot.yIndex
    
            let firstSpot = returnSpotFromCoords(x1 + directionX,y1 - directionY)
            let secondSpot = returnSpotFromCoords(x1 + directionX,y1 + directionY)

            let possibleMoves = [firstSpot,secondSpot]

            this.killLogic(possibleMoves)

            // check if blocked. Callback function of the array filter function returns the oppsite of what the blocked value of each spot is.
            // so if the blocked spot returns true, the callback function returns false and the filter function removes it
            let filteredMoves = possibleMoves.filter(
                (spot,index,array) => {
                    if (array[index] !== undefined){
                        return (!(array[index].blocked))
                    }
                }
            )

        return filteredMoves; }

        kingLogic () {
            let x1 = this.currentSpot.xIndex
            let y1 = this.currentSpot.yIndex

            let up = returnSpotFromCoords(x1 - 1, y1)
            let down = returnSpotFromCoords(x1 + 1, y1)
            let left = returnSpotFromCoords(x1, y1 - 1)
            let right = returnSpotFromCoords(x1, y1 + 1)

            let upLeft = returnSpotFromCoords(x1 - 1, y1 - 1)
            let upRight = returnSpotFromCoords(x1 - 1, y1 + 1)
            let downLeft = returnSpotFromCoords(x1 + 1, y1 - 1)
            let downRight = returnSpotFromCoords(x1 + 1, y1 + 1)

            let possibleMoves = [up,down,left,right,upLeft,upRight,downLeft,downRight]

            this.killLogic(possibleMoves)

            let filteredMoves = possibleMoves.filter(
                (spot,index,array) => {
                    if (array[index] !== undefined && array[index].blocked !== true) {
                        return true
                    }
                }
            )

            return filteredMoves
        }

        killLogic(possibleMoves) {
            // kill logic

            possibleMoves.forEach(element => {
                if (element !== undefined && getPieceFromSpot(element) && getPieceFromSpot(element).color !== this.color) {
                    this.killMoves.add(element)
                    checkKillList.add(element)
                }
            });

            // logic to see if any king is in check
            checkKillList.forEach(spot => {
                
                if (getPieceFromSpot(spot) && getPieceFromSpot(spot).name === "king") {
                    // getPieceFromSpot(spot).pieceDiv.style.backgroundColor = 'purple'

                    socket.emit('kingInCheck', getPieceFromSpot(spot).camelCaseName,gameID)
                } 
            });

            // if no kings are in check, remove purple background from all kings
            if(isKingInCheck() === false) {
                pieceList.forEach((piece) => {
                    if (piece && piece.name === 'king') {
                        // piece.pieceDiv.style.backgroundColor = ""
                        socket.emit('kingNotInCheck',gameID)
                    }
                })
            }

            // create the div 'button' on each potential kill spot
            this.killMoves.forEach(element => {
                let newKillSpot = document.createElement('div')
                    newKillSpot.className = 'kill-spot'
                    element.spotDiv.appendChild(newKillSpot)

                    // emit a socket 
                    newKillSpot.addEventListener('click',(event) => {
                        socket.emit('kill', getPieceFromSpot(element).camelCaseName, gameID)
                        this.pickSpot(element.index)
                    })
                    

                    newKillSpot.style.top = element.position.top + 'px'
                    newKillSpot.style.left = element.position.left + 'px'
                })
            }

        killFunc(deadPiece) {

            removeDeadPiece(deadPiece)
        
            clearKillSpots()
            this.killMoves = new Set([])

            // delete the piece instance from array of pieces
            let deadPieceIndex = pieceList.indexOf(deadPiece)
            pieceList.splice(deadPieceIndex,1)

            this.updatePossibleMoves()
        }

        // highlight the king if he is in check
        setCheck(check) {
            if (check) {
                this.currentSpot.spotDiv.style.backgroundColor = "purple";
            } else {
                this.currentSpot.spotDiv.style.backgroundColor = "";
            }
        }
    }

let rowCount = 0
let rowNumber = 1

class Spot {
    constructor(index,xIndex,yIndex){
        this.index = index;
        this.blocked = false;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.limit = false

        // create the div for the chessboard spot and add to board
        this.spotDiv = document.createElement('div');
        this.spotDiv.id = index
        boardDiv.appendChild(this.spotDiv);

        // check what row number this is on
        if (rowCount < 8){
            rowCount ++;
        }else {
            rowCount = 1;
            rowNumber ++;
        }

        // check if even or odd
        if (rowNumber % 2 == 0){
            index%2 == 0 ? this.spotDiv.className = "odd-spot" : this.spotDiv.className = "even-spot"
        }else {
            index%2 == 0 ? this.spotDiv.className = "even-spot" : this.spotDiv.className = "odd-spot"
        }

        // check if this spot is a limit
        if (this.xIndex == 0 || this.yIndex == 0 || this.xIndex == 7 || this.yIndex == 7) {
            this.limit = true
        }

        // print some info on the tiles
        // this.spotDiv.innerHTML = this.xIndex + "," + this.yIndex + '<br>' + this.index

    }
    
    get position() {
        //get x and y spot of the div and set it to the spot class x and y elements
        this.top = this.spotDiv.getBoundingClientRect().top
        this.left = this.spotDiv.getBoundingClientRect().left

        return {top: this.top,
                left: this.left}
    }

    block() {
        this.blocked = true
    }
}

// these variables are used to give each spot an x and y index
let xInit = 8
let xIndex = 0
let yIndex = 0
let indexCount = 0


    // init all spots
function initSpots() {
    for (let index = 0; index < 64; index++) {
        const newSpot = new Spot(index,xIndex,yIndex);
        spotList.push(newSpot)

        indexCount++

        // this sets the x index. Adds one to index every 8 times.
        if (indexCount === xInit) {
            xInit = xInit + 8
            xIndex ++
        }

        // this sets the y index. Adds one to index until 7 and then starts over
        if (yIndex < 7) {
            yIndex ++;
        } else if (yIndex === 7){
            yIndex = 0;
        }
    }
}

initSpots()

socket.on('game-start', (state) => {
    waitingForPlayerOverlay.style.display = "none";
    initPieces(state)
    toggleTurn(state.whiteTurn)

})

socket.on('updateState', (state) => {
    removeAllPieces()
    initPieces(state)
})

// the selected piece will kill the piece returned from the socket
socket.on('confirmKill', (killedPiece) => {

    let killedPieceInstance = pieceList.filter((piece) => {
        return piece.camelCaseName === killedPiece;
    })[0]

    selectedPiece.killFunc(killedPieceInstance)

    // this will end the game
    if (killedPieceInstance.name === 'king') {
        gameOver(killedPieceInstance.color)
    }
})

socket.on('giveMeYourInfo', () => {
    socket.emit('playerInfo',myID,myUserName )
})


// chat functions
function sendChat(msg) {
    socket.emit('send-message', msg, gameID)
    chatInput.value = ""
}

chatButton.addEventListener('click', (e) => {
    sendChat(`${myUserName}: ${chatInput.value}`)
})

chatInput.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        sendChat(`${myUserName}: ${chatInput.value}`)
    }
})

socket.on('broadcast-message', (msg) => {
    chatBox.value = `${chatBox.value}\n\n ${msg}`
    
    // keep textbox at the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
})