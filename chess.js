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
var squares = [];

// this keeps track of the number of moves to enforce
var turn = 0;

// make maps for to number spaces to automate which pieces get placed
var cols = new Map([
  [20, "a"],
  [84, "b"],
  [148, "c"],
  [212, "d"],
  [276, "e"],
  [340, "f"],
  [404, "e"],
  [468, "h"]
]);

var rows = new Map([
  [20, "8"],
  [84, "7"],
  [148, "6"],
  [212, "5"],
  [276, "4"],
  [340, "3"],
  [404, "2"],
  [468, "1"]
]);

var sources = new Map([
  ["a1", "pieces/white/whiteRook.png"],
  ["b1", "pieces/white/whiteKnight.png"],
  ["c1", "pieces/white/whiteBishop.png"],
  ["d1", "pieces/white/whiteQueen.png"],
  ["e1", "pieces/white/whiteKing.png"],
  ["f1", "pieces/white/whiteBishop.png"],
  ["g1", "pieces/white/whiteKnight.png"],
  ["h1", "pieces/white/whiteRook.png"],
  ["a2", "pieces/white/whitePawn.png"],
  ["b2", "pieces/white/whitePawn.png"],
  ["c2", "pieces/white/whitePawn.png"],
  ["d2", "pieces/white/whitePawn.png"],
  ["e2", "pieces/white/whitePawn.png"],
  ["f2", "pieces/white/whitePawn.png"],
  ["g2", "pieces/white/whitePawn.png"],
  ["h2", "pieces/white/whitePawn.png"]
]);

// -----------------------------------------------------------------------------
// -------------------------- CANVAS EVENT HANDLER -----------------------------
// -----------------------------------------------------------------------------

// determine which square was clicked, returning the index of the square's
// position in a list of lists where the outer list represents the row and the
// inner list represents the column
function determine_square(event) {
  // the x and y coordinates of the upper left corner of the square that was
  // clicked
  var x = event.pageX - buffer;
  var y = event.pageY - buffer;

  // the indices into a list of lists
  var result = [];

  // get the index of the row in which the square exists
  var i;
  for (i = 1; y > sideLength * i; i++);

  result.push(i - 1);

  // get the index of the column in which the square exists
  for (i = 1; x > sideLength * i; i++);

  result.push(i - 1);
  return result;
}

// perform some action depending on which square was clicked
function canvas_events(event) {
  var clicked = determine_square(event);

  // this is all test code right now
  clicked = squares[clicked[0]][clicked[1]];
  clicked.drawSquare("#FF0000");
}

// -----------------------------------------------------------------------------
// ------------------------------- SPACE CLASS ---------------------------------
// -----------------------------------------------------------------------------

class Space {
  // make the space
  constructor(x, y) {
    // the position of the space
    this.x = x;
    this.y = y;
    this.piece = null; // this will be updated once a piece is placed
  }

  drawSquare(color) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, sideLength, sideLength);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    placePiece(this.x, this.y, this);
  }
}

// -----------------------------------------------------------------------------
// ------------------------------- MAKE BOARD ----------------------------------
// -----------------------------------------------------------------------------

// draw a full row on the board, returning a list of all the spaces
// NOTE: Colors are given in hex value because the pieces used do not have
//       outlines that set them apart from the background. The reason for the
//       hex colors is to provide colors that will allow the pieces to be seen
function makeRow(x, y) {
  // set color of the first square in the row
  var color = (y - buffer) % (2 * sideLength) == 0 ? "#CCCCCB" : "#000022";

  var row = [];

  // draw 8 squares, alternating the color each time
  for (x = buffer; x < boardLength - buffer; x += sideLength) {
    row.push(new Space(x, y));
    row[row.length - 1].drawSquare(color);
    color = color == "#CCCCCB" ? "#000022" : "#CCCCCB";
  }

  return row;
}

// get the canvas from the HTML document and make the board
function makeBoard() {
  // the starting x and y coordinates of each row
  var x = buffer;

  for (var y = buffer; y < boardLength - buffer; y += sideLength) {
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
function placePiece(x, y, space) {
  // get the container for the image
  var container = document.getElementById("image-container");

  // make a new div for the image, oh boy this is gonna get complicated...
  var imgDiv = document.createElement("DIV");
  imgDiv.style.position = "absolute";

  /*
  big thanks to harshitpthk on StackOverflow for answering a similar question
  https://stackoverflow.com/questions/32516488/set-position-of-div-dynamically
  */
  imgDiv.style.top = y.toString() + "px";
  imgDiv.style.left = x.toString() + "px";

  // make an element for the image
  var img = document.createElement("IMG");
  img.width = sideLength; // set the width
  img.height = sideLength; // set the height

  // get the source for the image
  var spaceName = cols.get(x) + rows.get(y);
  var pieceSource = sources.get(spaceName);

  // set the source for the image
  if (pieceSource) img.src = pieceSource;

  // add the image to its div
  imgDiv.appendChild(img);

  // add the new div to the screen
  container.appendChild(imgDiv);
}

// -----------------------------------------------------------------------------
// -------------------------------- RUN CODE -----------------------------------
// -----------------------------------------------------------------------------

makeBoard();

// pass the function canvas_events as a parameter which will automatically be
// passed the event as a parameter when called
board.addEventListener("click", canvas_events, false);
