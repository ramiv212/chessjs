const app = document.getElementById('app')

// dialog box for upgrading pawn
const dialogBox = document.getElementById('pawnUpdate');
const selectEl = dialogBox.querySelector('select');
const confirmBtn = dialogBox.querySelector('#confirmBtn');

const playerOneTurnDisplay = document.getElementById('player-one-turn')
const playerTwoTurnDisplay = document.getElementById('player-two-turn')


const spotList = []
const pieceList = []

let selectedPiece = null
let moveBeingPicked = false

let whiteTurn = true

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
function clearKillSpots() {
    spotList.forEach(element => {
        if (element.spotDiv.childNodes) {
            let children = Array.from(element.spotDiv.childNodes)
            killSpots = children.slice(3)
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
        if (element.spotDiv.childNodes[3]) {
            element.spotDiv.childNodes[3].remove()
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


function unBlockHoverForAllOtherSpots() {
    pieceList.forEach(element => {
            element.canHighlight = true
    })
}

function showBlockStatus() {
    // show block status
    pieceList.forEach(element => {
        element.pieceDiv.innerHTML = "<b>" + element.canHighlight + "</b>"
    });
}


class Piece {
    constructor(color,name,currentSpot,index) {
        this.name = name;
        this.color = color;
        this.selected = false;
        this.index = index
        this.currentSpot = currentSpot
        this.possibleMoves = []
        this.killMoves = new Set([])
        this.canHighlight = true
        this.timesMoved = 0
        this.turn = false

        // add all pieces to pieceList
        pieceList.push(this)

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
        if (moveBeingPicked === false) {
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
                let killMoveMiddle = this.nextMoveSpot
                let killMoveRight = returnSpotFromCoords(this.nextMoveSpot.xIndex,this.nextMoveSpot.yIndex + 1)

                let pawnKillMoves = [killMoveLeft,killMoveMiddle,killMoveRight]

                // first turn kill logic
                if (this.timesMoved < 1) {
                    let firstTurnKillMove = returnSpotFromCoords(this.nextMoveSpot.xIndex + 1,this.nextMoveSpot.yIndex)
                    pawnKillMoves.push(firstTurnKillMove)
                }
        
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
                let killMoveMiddle = this.nextMoveSpot
                let killMoveRight = returnSpotFromCoords(this.nextMoveSpot.xIndex,this.nextMoveSpot.yIndex + 1)

                let pawnKillMoves = [killMoveLeft,killMoveMiddle,killMoveRight]

                // first turn kill logic
                if (this.timesMoved < 1) {
                    let firstTurnKillMove = returnSpotFromCoords(this.nextMoveSpot.xIndex - 1,this.nextMoveSpot.yIndex)
                    pawnKillMoves.push(firstTurnKillMove)
                }
        
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

            let up = this.bishopLogic(this.xIndex,this.yIndex,-1,0,0,0) // up left
            let down = this.bishopLogic(this.xIndex,this.yIndex,1,0,7,7) // down right
            let right = this.bishopLogic(this.xIndex,this.yIndex,0,1,0,7) // up right
            let left = this.bishopLogic(this.xIndex,this.yIndex,0,-1,7,0) // down left

            this.possibleMoves = [...upLeft,...downRight,...upRight,...downLeft,...up,...down,...right,...left]
        }
        
    }

    select() {  

        if (this.turn) {
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

        // turns
        whiteTurn = (!whiteTurn)
        toggleTurn()

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
                if(getPieceFromSpot(nextMove[0]).color !== this.color) {
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
                if(getPieceFromSpot(nextMove[0]).color !== this.color) {
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
                if(getPieceFromSpot(nextMove[0]).color !== this.color) {
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
                if(getPieceFromSpot(nextMove[0]).color !== this.color) {
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
                }
            });

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

            deadPiece.pieceDiv.parentElement.remove()
            clearKillSpots()
            this.killMoves = new Set([])
            
            // delete the piece instance from array of pieces
            let deadPieceIndex = pieceList.indexOf(deadPiece)
            pieceList.splice(deadPieceIndex,1)

            // remove "blocked" from the spot
            spot.blocked = false
            this.updatePossibleMoves()

            this.pickSpot(spot.index)
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
        this.spotDiv.innerHTML = this.xIndex + "," + this.yIndex + '<br>' + this.index

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


// init white pawns
const whitePawn1 = new Piece('white', 'pawn', spotList[48],0)
const whitePawn2 = new Piece('white', 'pawn', spotList[49],1)
const whitePawn3 = new Piece('white', 'pawn', spotList[50],2)
const whitePawn4 = new Piece('white', 'pawn', spotList[51],3)
const whitePawn5 = new Piece('white', 'pawn', spotList[52],4)
const whitePawn6 = new Piece('white', 'pawn', spotList[53],5)
const whitePawn7 = new Piece('white', 'pawn', spotList[54],6)
const whitePawn8 = new Piece('white', 'pawn', spotList[55],7)

// init white specials
const whiteRook1 = new Piece('white', 'rook', spotList[56],8)
const whiteBishop1 = new Piece('white', 'bishop', spotList[57],9)
const whiteKnight1 = new Piece('white', 'knight', spotList[58],10)
const whiteQueen = new Piece('white', 'queen', spotList[59],11)
const whiteKing = new Piece('white', 'king', spotList[60],12)
const whiteKnight2 = new Piece('white', 'knight', spotList[61],13)
const whiteBishop2 = new Piece('white', 'bishop', spotList[62],14)
const whiteRook2 = new Piece('white', 'rook', spotList[63],15)



// init black pawns
const blackPawn3 = new Piece('black', 'pawn', spotList[8],16)
const blackPawn1 = new Piece('black', 'pawn', spotList[9],17)
const blackPawn2 = new Piece('black', 'pawn', spotList[10],18)
const blackPawn4 = new Piece('black', 'pawn', spotList[11],19)
const blackPawn5 = new Piece('black', 'pawn', spotList[12],20)
const blackPawn6 = new Piece('black', 'pawn', spotList[13],21)
const blackPawn7 = new Piece('black', 'pawn', spotList[14],22)
const blackPawn8 = new Piece('black', 'pawn', spotList[15],23)

// init black specials
const blackRook1 = new Piece('black', 'rook', spotList[0],24)
const blackBishop1 = new Piece('black', 'bishop', spotList[1],25)
const blackKnight1 = new Piece('black', 'knight', spotList[2],26)
const blackQueen = new Piece('black', 'queen', spotList[3],27)
const blackKing = new Piece('black', 'king', spotList[4],28)
const blackKnight2 = new Piece('black', 'knight', spotList[5],29)
const blackBishop2 = new Piece('black', 'bishop', spotList[6],30)
const blackRook2 = new Piece('black', 'rook', spotList[7],31)


function check() {
// 
}

function toggleTurn() {
    if (whiteTurn) {
        pieceList.forEach(piece => {
            if(piece.color === "white") {
                piece.turn = true
            } else {
                piece.turn = false
            }
        });

        playerOneTurnDisplay.innerText = "- Your Turn"
        playerTwoTurnDisplay.innerText = ""

        check()

    } else {
        pieceList.forEach(piece => {
            if(piece.color === "black") {
                piece.turn = true
            } else {
                piece.turn = false
            }
        });

        playerOneTurnDisplay.innerText = ""
        playerTwoTurnDisplay.innerText = "- Your Turn"

        check()
    }
}

toggleTurn()
