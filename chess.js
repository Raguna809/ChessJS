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

// map pixel number to letter of column on board
var cols = new Map([
  [20, "a"],
  [84, "b"],
  [148, "c"],
  [212, "d"],
  [276, "e"],
  [340, "f"],
  [404, "g"],
  [468, "h"]
]);

// map pixel number to number of row on board
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

// map square names to piece image sources
var sources = new Map([
  // white pieces
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
  ["h2", "pieces/white/whitePawn.png"],
  // black pieces
  ["a8", "pieces/black/blackRook.png"],
  ["b8", "pieces/black/blackKnight.png"],
  ["c8", "pieces/black/blackBishop.png"],
  ["d8", "pieces/black/blackKing.png"],
  ["e8", "pieces/black/blackQueen.png"],
  ["f8", "pieces/black/blackBishop.png"],
  ["g8", "pieces/black/blackKnight.png"],
  ["h8", "pieces/black/blackRook.png"],
  ["a7", "pieces/black/blackPawn.png"],
  ["b7", "pieces/black/blackPawn.png"],
  ["c7", "pieces/black/blackPawn.png"],
  ["d7", "pieces/black/blackPawn.png"],
  ["e7", "pieces/black/blackPawn.png"],
  ["f7", "pieces/black/blackPawn.png"],
  ["g7", "pieces/black/blackPawn.png"],
  ["h7", "pieces/black/blackPawn.png"]
]);

// the currently selected piece
var currentPiece = null;

// the target space for piece movement
var targetSpace = null;

var game;

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
  // get the piece that has been clicked
  var clicked = determine_square(event);
  clicked = squares[clicked[0]][clicked[1]];

  // see if we need a space or a piece
  // if there is a current piece we need a space
  if (currentPiece) {
    console.log("setting target", clicked.x, clicked.y);
    // set the target space
    targetSpace = clicked;

    // start the turn
    game.playTurn();

    // escape the event handler
    return;
  }

  // since we need a piece ...
  // get the clicked piece
  let p = clicked.piece;

  // if there was no piece do nothing
  if (!p) return;

  console.log("setting piece", p.img.src);

  // check if the word "white" if found in the source path for the piece
  // USE A REGEX

  // if the word "white" is found and the player is white set the current piece

  // if the word "white" is found and the player is not white do nothing

  // if the word "white" not is found and the player is not white set the
  // current piece

  // if the word "white" is found and the player is white do nothing

  currentPiece = p;
}

// -----------------------------------------------------------------------------
// ------------------------------ PLAYER CLASS ---------------------------------
// -----------------------------------------------------------------------------

class Player {
  // make the player
  constructor(number) {
    // so we know which player wins at the end of the game
    this.number = number;
  }

  // determine whether the player has a king
  hasKing() {
    return true;
  }
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
// ------------------------------- PIECE CLASS ---------------------------------
// -----------------------------------------------------------------------------

class Piece {
  // make the piece
  constructor(img, div, space) {
    // the image associated with the piece
    this.img = img;

    // the html div associated with the image
    this.div = div;

    // the space the piece is on
    this.space = space;
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
  var color = (y - buffer) % (2 * sideLength) == 0 ? "#CCCCCB" : "#555577";
  var row = [];

  // draw 8 squares, alternating the color each time
  for (x = buffer; x < boardLength - buffer; x += sideLength) {
    row.push(new Space(x, y));
    row[row.length - 1].drawSquare(color);
    color = color == "#CCCCCB" ? "#555577" : "#CCCCCB";
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

  // set the source for the image only if the piece is valid
  if (pieceSource) {
    img.src = pieceSource;

    // add the image to its div
    imgDiv.appendChild(img);

    // add the new div to the screen
    container.appendChild(imgDiv);
  }

  // add the image to the board
  space.piece = new Piece(img, imgDiv, space);

  // pass the event handler of the canvas to the images
  this.addEventListener("click", canvas_events, false);
}

// -----------------------------------------------------------------------------
// ------------------------------- GAME CLASS ----------------------------------
// -----------------------------------------------------------------------------

class Game {
  // make the game
  constructor() {
    // make an array to hold the players so we can easily track which player is
    // allowed to interact with the board. this isn't super important, but in
    // this implementation, the player at index 0 is player 2 and the player at
    // index 1 is player 1. this just makes it easier to keep track of with the
    // turn counter
    this.players = [new Player(2), new Player(1)];

    // reset the number of turns that have passed
    turn = 0;

    // generate all of the spaces and add all of the images
    makeBoard();

    // pass the function canvas_events as a parameter which will automatically
    // be passed the event as a parameter when called
    board.addEventListener("click", canvas_events, false);
  }

  // move the selected piece to the target space
  movePiece() {
    // return if we don't have both a piece and a space
    if (!currentPiece || !targetSpace) return;

    console.log("moving");
    // remove the old space's ownership of the piece
    currentPiece.space.piece = null;

    // move the piece graphic
    currentPiece.div.style.top = targetSpace.y.toString() + "px";
    currentPiece.div.style.left = targetSpace.x.toString() + "px";

    // if the space had a piece, remove the piece from the board

    // give the piece to the space
    targetSpace.piece = currentPiece;

    // clear the current piece and the target space
    currentPiece = null;
    targetSpace = null;
  }

  // play a single turn
  playTurn() {
    console.log(turn);
    // increment the turn counter
    turn++;

    this.movePiece();
  }
}

// -----------------------------------------------------------------------------
// -------------------------------- RUN CODE -----------------------------------
// -----------------------------------------------------------------------------

// setup the game
game = new Game();
