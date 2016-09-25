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

Board.prototype.move_gem = function(gem, vector, check_gem_position=true){
  var new_position = [gem.pos_x + vector[0], gem.pos_y + vector[1]]
  var other_gem = this.find_gem_by_position(new_position);

  gem.move(vector);

  var reverse_vector = [-vector[0], -vector[1]];
  other_gem.move(reverse_vector);

  if (check_gem_position) {
    var matching_shapes = this.matching_shapes([gem, other_gem]);
    if (matching_shapes.length > 0) {
      console.log("Valid move");
      this.remove_shapes(matching_shapes);
    }
    else {
      console.log("Not valid, reversing");
      this.move_gem(gem, reverse_vector, false);
    };
  }

  this.canvas.renderAll();
}

Board.prototype.matching_shapes = function(gems){
  var shapes = [];

  var _this = this;
  _.each(gems, function(gem){
    var shape = _this.matching_shape_for(gem);
    if (shape) {
      shapes.push(shape);
    }
  })

  return shapes
}

Board.prototype.matching_shape_for = function(gem){
  var matching_shape = null;

  return matching_shape;
}

Board.prototype.remove_shapes = function(shapes){
  _.each(shapes, function(shape){
    shape.remove();
  })
}

Board.prototype.gem_matches = function(gem){
  var positions = [
    [[gem.pos_x + 1, gem.pos_y], [gem.pos_x + 2, gem.pos_y]],
    [[gem.pos_x - 1, gem.pos_y], [gem.pos_x + 1, gem.pos_y]],
    [[gem.pos_x - 2, gem.pos_y], [gem.pos_x - 1, gem.pos_y]],
    [[gem.pos_x, gem.pos_y + 1], [gem.pos_x, gem.pos_y + 2]],
    [[gem.pos_x, gem.pos_y - 1], [gem.pos_x, gem.pos_y + 1]],
    [[gem.pos_x, gem.pos_y - 2], [gem.pos_x, gem.pos_y - 1]]
  ];

  for(var i = 0; i < 6; i++){
    if (this.gem_match_permuation(gem, positions[i])) { 
      return true; 
    }
  }
  return false;
}

Board.prototype.gem_match_permuation = function(gem, positions) {
  var second_gem = this.find_gem_by_position(positions[0]);
  var third_gem = this.find_gem_by_position(positions[1]);

  if(second_gem == undefined || third_gem == undefined){ return false }
  if(gem.color === second_gem.color && gem.color === third_gem.color){ return true }
}

Board.prototype.find_gem_by_screen_position = function(position){
  var normalised_pos = [Math.floor(position[0]/50), Math.floor(position[1]/50)];
  return this.find_gem_by_position(normalised_pos);
}

Board.prototype.find_gem_by_position = function(position){
  return _.find(this.gems, function(gem){ 
    return (gem.pos_x == position[0] && gem.pos_y == position[1]);
  })
}
