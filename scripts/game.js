var Game = function (width, height) {
  console.log("Initialising game with");
  console.log(width);
  console.log(height);

  this.width = width;
  this.height = height;
};

Game.prototype.start = function(){
  console.log("Start game loop");
};
