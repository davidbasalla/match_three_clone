var Board = function (width, height, canvas) {
  this.width = width;
  this.height = height;
  this.canvas = canvas;
  this.gem_types = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  this.gems = [];

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
    _this.canvas.add(gem.shape);
  })
}

Board.prototype.move_gem = function(gem, vector){
  var new_position = [gem.pos_x + vector[0], gem.pos_y + vector[1]]
  var other_gem = this.find_gem_by_position(new_position);

  gem.move(vector);

  var reverse_vector = [-vector[0], -vector[1]];
  other_gem.move(reverse_vector);

  this.canvas.renderAll();
}

Board.prototype.find_gem_by_screen_position = function(position){
  var normalised_pos = [Math.floor(position[0]/50), Math.floor(position[1]/50)];
  return this.find_gem_by_position(normalised_pos)
}

Board.prototype.find_gem_by_position = function(position){
  return _.find(this.gems, function(gem){ 
    return (gem.pos_x == position[0] && gem.pos_y == position[1]);
  })
}
