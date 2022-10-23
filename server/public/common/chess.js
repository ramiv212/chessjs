const app = document.getElementById('app')

// dialog box for upgrading pawn
const dialogBox = document.getElementById('pawnUpdate');
const selectEl = dialogBox.querySelector('select');
const confirmBtn = dialogBox.querySelector('#confirmBtn');

const playerOneTurnDisplay = document.getElementById('player-one-turn')
const playerTwoTurnDisplay = document.getElementById('player-two-turn')

const deadWhitePiecesDiv = document.getElementById('dead-white-pieces')
const deadBlackPiecesDiv = document.getElementById('dead-black-pieces')

const spotList = []
let pieceList = []

let whiteTurn = true

let amIwhite = null

let gameID = null

socket.on('player-info',(info) => {
    if (info !== null) {
        document.getElementById('player-one-name').innerText = info.player1.name
        document.getElementById('player-two-name').innerText = info.player2.name
    }

    //  check if current player is player one (white)
    if (document.getElementById('myUserName').innerText === info.player1.name) {
        amIwhite = true
    } else {
        amIwhite = false
    }
})


function initPieces (state) {
    removeAllPieces()
    pieceList = []

    // init white pawns
    let whitePawn1 = new Piece('white', 'pawn', 'whitePawn1', spotList[state.whitePawn1.position],0)
    let whitePawn2 = new Piece('white', 'pawn', 'whitePawn2', spotList[state.whitePawn2.position],1)
    let whitePawn3 = new Piece('white', 'pawn', 'whitePawn3', spotList[state.whitePawn3.position],2)
    let whitePawn4 = new Piece('white', 'pawn', 'whitePawn4', spotList[state.whitePawn4.position],3)
    let whitePawn5 = new Piece('white', 'pawn', 'whitePawn5', spotList[state.whitePawn5.position],4)
    let whitePawn6 = new Piece('white', 'pawn', 'whitePawn6', spotList[state.whitePawn6.position],5)
    let whitePawn7 = new Piece('white', 'pawn', 'whitePawn7', spotList[state.whitePawn7.position],6)
    let whitePawn8 = new Piece('white', 'pawn', 'whitePawn8', spotList[state.whitePawn8.position],7)

    // init white specials
    let whiteRook1 = new Piece('white', 'rook',     'whiteRook1',  spotList[state.whiteRook1.position],8)
    let whiteBishop1 = new Piece('white', 'bishop', 'whiteBishop1',spotList[state.whiteBishop1.position],9)
    let whiteKnight1 = new Piece('white', 'knight', 'whiteKnight1',spotList[state.whiteKnight1.position],10)
    let whiteQueen = new Piece('white', 'queen',    'whiteQueen',  spotList[state.whiteQueen.position],11)
    let whiteKing = new Piece('white', 'king',      'whiteKing',   spotList[state.whiteKing.position],12)
    let whiteKnight2 = new Piece('white', 'knight', 'whiteKnight2',spotList[state.whiteKnight2.position],13)
    let whiteBishop2 = new Piece('white', 'bishop', 'whiteBishop2',spotList[state.whiteBishop2.position],14)
    let whiteRook2 = new Piece('white', 'rook',     'whiteRook2',  spotList[state.whiteRook2.position],15)



    // init black pawns
    let blackPawn1 = new Piece('black', 'pawn', 'blackPawn1', spotList[state.blackPawn1.position],16)
    let blackPawn2 = new Piece('black', 'pawn', 'blackPawn2', spotList[state.blackPawn2.position],17)
    let blackPawn3 = new Piece('black', 'pawn', 'blackPawn3', spotList[state.blackPawn3.position],18)
    let blackPawn4 = new Piece('black', 'pawn', 'blackPawn4', spotList[state.blackPawn4.position],19)
    let blackPawn5 = new Piece('black', 'pawn', 'blackPawn5', spotList[state.blackPawn5.position],20)
    let blackPawn6 = new Piece('black', 'pawn', 'blackPawn6', spotList[state.blackPawn6.position],21)
    let blackPawn7 = new Piece('black', 'pawn', 'blackPawn7', spotList[state.blackPawn7.position],22)
    let blackPawn8 = new Piece('black', 'pawn', 'blackPawn8', spotList[state.blackPawn8.position],23)

    // init black specials
    let blackRook1 = new Piece('black', 'rook',     'blackRook1',   spotList[state.blackRook1.position],24)
    let blackBishop1 = new Piece('black', 'bishop', 'blackBishop1', spotList[state.blackBishop1.position],25)
    let blackKnight1 = new Piece('black', 'knight', 'blackKnight1', spotList[state.blackKnight1.position],26)
    let blackQueen = new Piece('black', 'queen',    'blackQueen',   spotList[state.blackQueen.position],27)
    let blackKing = new Piece('black', 'king',      'blackKing',    spotList[state.blackKing.position],28)
    let blackKnight2 = new Piece('black', 'knight', 'blackKnight2', spotList[state.blackKnight2.position],29)
    let blackBishop2 = new Piece('black', 'bishop', 'blackBishop2', spotList[state.blackBishop2.position],30)
    let blackRook2 = new Piece('black', 'rook',     'blackRook2',   spotList[state.blackRook2.position],31)

    pieceList.push(whitePawn1,whitePawn2,whitePawn3,whitePawn4,whitePawn5,whitePawn6,whitePawn7,whitePawn8,
                    whiteRook1,whiteBishop1,whiteKnight1,whiteQueen,whiteKing,whiteKnight2,whiteBishop2,whiteRook2,
                    blackPawn1,blackPawn2,blackPawn3,blackPawn4,blackPawn5,blackPawn6,blackPawn7,blackPawn8,
                    blackRook1,blackBishop1,blackKnight1,blackQueen,blackKing,blackKnight2,blackBishop2,blackRook2,
                    )
    
    whiteTurn = state.whiteTurn

    gameID = state.gameID
    
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
    console.log(isWhite)
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
    pieceList.forEach(element => {
        element.pieceDiv.innerHTML = "<b>" + element.canHighlight + "</b>"
    });
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
        piece.pieceDiv.remove()
    })
}


function gameOver(color) {
    if (color === 'black') {
        alert('White wins!')
    } else {
        alert('Black Wins!')
    }

    removeAllPieces()

    // remove pieces from dead areas
    deadBlackPiecesDiv.innerHTML = ""
    deadWhitePiecesDiv.innerHTML = ""

    initPieces()

    whiteTurn = true

}


// returns flase if none of the kings are in check. If one of them is in check it returns true.
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
    constructor(color,name,camelCaseName,currentSpot,index) {
        this.color = color;
        this.name = name;
        this.camelCaseName = camelCaseName;
        this.selected = false;
        this.index = index
        this.currentSpot = currentSpot
        this.possibleMoves = []
        this.killMoves = new Set([])
        this.canHighlight = true
        this.timesMoved = 0
        this.turn = false
        this.dead = false

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

        // block the spot that this piece is on
        this.currentSpot.blocked = true

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

        this.PickSpotCallback = function() {
            this.pickSpot()
        }

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
        if ((this.currentSpot.xIndex === 7 && this.name === 'pawn' && this.color === 'black') || (this.currentSpot.xIndex === 0 && this.name === 'pawn' && this.color === 'white')) {
            // convert piece logic
            dialogBox.showModal()
            confirmBtn.onclick = () => {
                this.name = selectEl.value.toLowerCase()
                this.pieceDiv.style.backgroundImage = "url('images/" + this.color + this.name + ".png')"
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
            this.convertPawnLogic()
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
            this.convertPawnLogic()
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

        if (amIwhite && whiteTurn || (!amIwhite) && (!whiteTurn)) {
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

        selectedPiece.currentSpot.blocked = false

        // remove event listeners from possible spots of selected piece
        selectedPiece.possibleMoves.forEach(element => {
            element.spotDiv.style.backgroundColor = ""
        });

        // update the selected piece currentSpot to newly picked spot
        selectedPiece.currentSpot = spotList[index]
        selectedPiece.currentSpot.blocked = true

        // position piece via x and y coords
        selectedPiece.containerDiv.style.top = selectedPiece.currentSpot.position.top + 'px';
        selectedPiece.containerDiv.style.left = selectedPiece.currentSpot.position.left + 'px'

        moveBeingPicked = false
        selectedPiece.pieceDiv.className = ""

        pieceList.forEach(element => {
            element.updatePossibleMoves()
            // todo update blocked tiles
        });

        clearPotentialMovesInBoard()
        // clear Killmoves set
        this.killMoves = new Set([])
        clearKillSpots()

        unBlockHoverForAllOtherSpots()

        // this is to check if pawns can move double initially
        this.timesMoved ++

        socket.emit('move', gameID ,state => {

            state[selectedPiece.camelCaseName].position = index
            
            initPieces(state)

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

    // TODO bishops can't kill top left
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
                    getPieceFromSpot(spot).pieceDiv.style.backgroundColor = 'purple'
                } 
            });

            // if no kings are in check, remove purple background from all kings
            if(isKingInCheck() === false) {
                pieceList.forEach((piece) => {
                    if (piece && piece.name === 'king') {
                        piece.pieceDiv.style.backgroundColor = ""
                    }
                })
            }


            this.killMoves.forEach(element => {
                let newKillSpot = document.createElement('div')
                    newKillSpot.className = 'kill-spot'
                    element.spotDiv.appendChild(newKillSpot)

                    newKillSpot.addEventListener('click',(event) => {
                        this.killFunc(element)
                    })

                    newKillSpot.style.top = element.position.top + 'px'
                    newKillSpot.style.left = element.position.left + 'px'
            })
        }

        killFunc(spot) {
            let deadPiece = getPieceFromSpot(spot)

            removeDeadPiece(deadPiece)
        
            clearKillSpots()
            this.killMoves = new Set([])
            
            // delete the piece instance from array of pieces
            let deadPieceIndex = pieceList.indexOf(deadPiece)
            pieceList.splice(deadPieceIndex,1)

            // remove "blocked" from the spot
            spot.blocked = false
            this.updatePossibleMoves()

            this.pickSpot(spot.index)

            // this will end the game
            if (deadPiece.name === 'king') {
                gameOver(deadPiece.color)
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


socket.on('gameStart', (state) => {
    initPieces(state)
    toggleTurn(state.whiteTurn)

})

socket.on('updateState', (state) => {
    removeAllPieces()
    initPieces(state)

})

