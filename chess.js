/*
Nate Koike
5 May 2019

Using TensorFlow to create an AI to play chess
*/

// -----------------------------------------------------------------------------
// ---------------------------- GLOBAL VARIABLES -------------------------------
// -----------------------------------------------------------------------------

// this is the length of one side of a square; it should be 1/8th the width of
// the board
var sideLength = 64;

// this is the amount of space that should be allowed around the board on each
// side
var buffer = 20;

// this is the length of one side of the board
var boardLength = 552;

// this keeps track of the number of moves to enforce
var turn = 0;
// -----------------------------------------------------------------------------
// ------------------------------- SPACE CLASS ---------------------------------
// -----------------------------------------------------------------------------


class Space {
  constructor(x, y) {
    // the position of the space
    this.x = x;
    this.y = y;

    // this is true if there is no piece on the space
    this.free = true;

    // make the spaces clickable
    this.addEventListener("click", function() {
      (this);
    });
  }
}

// -----------------------------------------------------------------------------
// ------------------------------- MAKE BOARD ----------------------------------
// -----------------------------------------------------------------------------

// get the board from the HTML document
var board = document.getElementById("board");

// get the context from the HTML document
var ctx = board.getContext("2d");

// draw a single square on the board
function drawSquare(x, y, color){
  ctx.beginPath();
  ctx.rect(x, y, sideLength, sideLength);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// draw a full row on the board
// NOTE: Colors are given in hex value because the pieces used do not have
//       outlines that set them apart from the background. The reason for the
//       hex colors is to provide colors that will allow the pieces to be seen
function makeRow(x, y){
  // set color of the first square in the row
  var color = (((y - buffer) % (2 * sideLength) == 0))? "#CCCCCB": "#000022";

  // draw 8 squares, alternating the color each time
  for (x = buffer; x < (boardLength - buffer); x += sideLength){
    drawSquare(x, y, color);
    color = (color == "#CCCCCB")? "#000022": "#CCCCCB";
  }
}

// get the canvas from the HTML document and make the board
function makeBoard(){
  // the starting x and y coordinates of each row
  var x = buffer;

  for (var y = buffer; y < (boardLength - buffer); y += sideLength){
    makeRow(x, y);
  }
}

// -----------------------------------------------------------------------------
// ------------------------------- SET PIECES ----------------------------------
// -----------------------------------------------------------------------------

/*
PIECES:
PAWN    x8 --
ROOK    x2 --
KNIGHT  x2 --
BISHOP  x2 --
KING    x1 --
QUEEN   x1 --
*/

// place all the pieces on the board
function placePieces(){
  return;
}

// -----------------------------------------------------------------------------
// -------------------------------- RUN CODE -----------------------------------
// -----------------------------------------------------------------------------

makeBoard();
console.log("made board...again");
