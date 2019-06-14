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

// get the board from the HTML document
var board = document.getElementById("board");

// get the context from the HTML document
var ctx = board.getContext("2d");

// this will be a list of lists of all the squares on the board
var squares = []

// this keeps track of the number of moves to enforce
var turn = 0;

// -----------------------------------------------------------------------------
// -------------------------- CANVAS EVENT HANDLER -----------------------------
// -----------------------------------------------------------------------------

// determine which square was clicked, returning the index of the square's
// position in a list of lists where the outer list represents the row and the
// inner list represents the column
function determine_square(event){
  // the x and y coordinates of the upper left corner of the square that was
  // clicked
  var x = event.pageX - buffer;
  var y = event.pageY - buffer;

  console.log([x, y]);

  // this will be returned the indices into a list of lists
  var result = [];

  // get the index of the row in which the square exists
  var index;
  for (index = 8; (y % (sideLength * index)) != 0 && index < 0; index--);

  result.push(index - 1);

  // get the index of the column in which the square exists
  for (index = 8; (x % (sideLength * index)) != 0  && index < 0; index--);

  result.push(index - 1);
  return result;
}

// perform some action depending on which square was clicked
function canvas_events(event){
  var clicked = determine_square(event);

  console.log(clicked);

  // this is all test code right now
  clicked = squares[clicked[0]][clicked[1]];
  clicked.drawSquare(clicked.x, clicked.y, "#FF0000");
}

// -----------------------------------------------------------------------------
// ------------------------------- SPACE CLASS ---------------------------------
// -----------------------------------------------------------------------------

class Space {
  // make the space
  constructor(x, y){
    // the position of the space
    this.x = x;
    this.y = y;
    this.piece = null; // this will be updated once a piece is placed
  }

  drawSquare(x, y, color){
    ctx.beginPath();
    ctx.rect(x, y, sideLength, sideLength);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
}

// -----------------------------------------------------------------------------
// ------------------------------- MAKE BOARD ----------------------------------
// -----------------------------------------------------------------------------

// draw a full row on the board, returning a list of all the spaces
// NOTE: Colors are given in hex value because the pieces used do not have
//       outlines that set them apart from the background. The reason for the
//       hex colors is to provide colors that will allow the pieces to be seen
function makeRow(x, y){
  // set color of the first square in the row
  var color = (((y - buffer) % (2 * sideLength) == 0))? "#CCCCCB": "#000022";

  var row = []

  // draw 8 squares, alternating the color each time
  for (x = buffer; x < (boardLength - buffer); x += sideLength){
    row.push(new Space(x, y));
    row[row.length - 1].drawSquare(x, y, color);
    color = (color == "#CCCCCB")? "#000022": "#CCCCCB";
  }

  return row;
}

// get the canvas from the HTML document and make the board
function makeBoard(){
  // the starting x and y coordinates of each row
  var x = buffer;

  for (var y = buffer; y < (boardLength - buffer); y += sideLength){
    squares.push(makeRow(x, y));
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

board.addEventListener('click', function(event) {
  canvas_events(event);
  }, false);
