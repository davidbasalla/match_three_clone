var Game = function (width, height) {
  this.width = width;
  this.height = height;

  this.canvas = new fabric.Canvas('c');

  console.log(this.canvas);
  this.board = new Board(this.width, this.height, this.canvas);
};

Game.prototype.start = function(){
  console.log("Start game loop");
  console.log(this.board);
  this.draw();
};

Game.prototype.draw = function(){
  this.board.draw();
}

// TODO
Game.prototype.handleKey = function(event){
  console.log("BLAH");
  console.log(event);
}

