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

Board.prototype.swap_gem = function(gem, vector, check_gem_position=true){
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
      this.refill_board();
    }
    else {
      console.log("Not valid, reversing");
      this.swap_gem(gem, reverse_vector, false);
    };
  }

  this.canvas.renderAll();
}

// Could extract this to a shape finder class, will take the board as param
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
  var matching_gems = [];

  var horizontal_gems = this.horizontal_matching_gems(gem);
  if (horizontal_gems.length > 0) {
    matching_gems = matching_gems.concat(horizontal_gems);
  }

  var vertical_gems = this.vertical_matching_gems(gem);
  if (vertical_gems.length > 0) {
    matching_gems = matching_gems.concat(vertical_gems);
  }

  if (matching_gems.length > 0){
    matching_shape = new Shape(_.uniq(matching_gems));
  }

  return matching_shape;
}

Board.prototype.horizontal_matching_gems = function(gem){
  var matching_gems = [gem];

  matching_gems = matching_gems.concat(this.walk_matching_gems(gem, 1, 0));
  matching_gems = matching_gems.concat(this.walk_matching_gems(gem, -1, 0));

  // clear gems if not more than 3
  if (matching_gems.length < 3){
    matching_gems = [];
  }

  return matching_gems;
}

Board.prototype.vertical_matching_gems = function(gem){
  var matching_gems = [gem];

  matching_gems = matching_gems.concat(this.walk_matching_gems(gem, 0, 1));
  matching_gems = matching_gems.concat(this.walk_matching_gems(gem, 0, -1));

  // clear gems if not more than 3
  if (matching_gems.length < 3){
    matching_gems = [];
  }

  return matching_gems;
}

Board.prototype.walk_matching_gems = function(gem, x_vector, y_vector){
  var position = gem.position();
  var matching_gems = [];
  position[0] += x_vector;
  position[1] += y_vector;

  var next_gem = this.find_gem_by_position(position);

  while(next_gem && next_gem.color == gem.color){
    matching_gems.push(next_gem);
    position[0] += x_vector;
    position[1] += y_vector;
    next_gem = this.find_gem_by_position(position);
  }

  return matching_gems;
}

Board.prototype.remove_shapes = function(shapes){
  // also need to remove the gem from the gems array

  var _this = this;
  _.each(shapes, function(shape){
    _.each(shape.gems, function(gem) {
      var index = _this.gems.indexOf(gem);
      _this.gems.splice(index, 1);

      _this.canvas.remove(gem.shape);
    })
  })
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

Board.prototype.refill_board = function(){
  this.apply_gravity();

  while(this.top_row_has_missing_gems()){
    this.add_new_gems_to_top();
    this.apply_gravity();
  }
}

Board.prototype.top_row_has_missing_gems = function(){
  for(var x = 0; x < this.width; x++){
    gem = this.find_gem_by_position([x, 0]);
    if (gem == null){
      return true;
    }
  }

  return false;
}

Board.prototype.add_new_gems_to_top = function(){
  for(var x = 0; x < this.width; x++){
    gem = this.find_gem_by_position([x, 0]);
    if (gem == null){
      var color = _.sample(this.gem_types);
      var new_gem = new Gem(color, x, 0);

      this.gems.push(new_gem);
      this.canvas.add(new_gem.shape);
    }
  }
}

// seems expensive to query each time, should use 2D array for storage
Board.prototype.apply_gravity = function(){
  var gem = null;
  for(var x = 0; x < this.width; x++){
    for(var y = this.height; y >= 0; y--){
      gem = this.find_gem_by_position([x, y]);
      if (gem){
        while(this.space_below_gem_is_free(gem)){
          gem.move([0, 1]);
        }
      }
    }
  }
}

Board.prototype.space_below_gem_is_free = function(gem){
  if(gem.pos_y == (this.height - 1)){
    return false;
  }

  if(this.find_gem_by_position([gem.pos_x, gem.pos_y + 1])){
    return false;
  }

  return true;
}
