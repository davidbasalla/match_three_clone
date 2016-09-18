var Board = function (width, height, canvas) {
  this.width = width;
  this.height = height;
  this.canvas = canvas;
  this.gem_types = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  this.gems = [];

  // fill the board
  this.fill();
};

Board.prototype.fill = function() {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      var color = _.sample(this.gem_types);

      this.gems.push(new Gem(color, x, y));
    }  
  }
};

Board.prototype.draw = function() {
  _this = this;
  _.each(this.gems, function(gem) {
    console.log(gem.shape);
    _this.canvas.add(gem.shape);
  })
}
