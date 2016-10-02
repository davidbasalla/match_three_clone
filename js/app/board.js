var Board = function (width, height, canvas, map) {
  this.width = width;
  this.height = height;
  this.canvas = canvas;
  this.map = map;

  this.gem_types = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  this.gems = [];

  if (map == null){
    this.fill();
  }
  else {
    this.load_map();
  }
};

Board.prototype.fill = function() {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      var color = _.sample(this.gem_types);

      this.gems.push(new Gem(color, x, y));
    }
  }
};

Board.prototype.load_map = function() {
  console.log("LOAD MAP");
  this.height = this.map.height;
  this.width = this.map.width;
  this.gems = this.map.gems;
}

Board.prototype.draw = function() {
  _this = this;
  _.each(this.gems, function(gem) {
    _this.canvas.add(gem.shape);
  })
}

Board.prototype.move_gem = function(gem, vector, callback_func=null){
  var move_attr = null;
  var move_amplitude = null;
  var vector_x = vector[0];
  var vector_y = vector[1];

  if (vector_x != 0){
    move_attr = 'left';
    if (vector_x > 0){
      move_amplitude = '+=' + Math.abs(vector_x*50).toString();
    }
    else {
      move_amplitude = '-=' + Math.abs(vector_x*50).toString();
    }
  }
  else {
    move_attr = 'top';
    if (vector_y > 0){
      move_amplitude = '+=' + Math.abs(vector_y*50).toString();
    }
    else {
      move_amplitude = '-=' + Math.abs(vector_y*50).toString();
    }
  }

  gem.pos_x += vector_x;
  gem.pos_y += vector_y;
  gem.shape.animate(move_attr, move_amplitude, { 
    onChange: this.canvas.renderAll.bind(this.canvas),
    onComplete: callback_func,
    duration: 150,
  });
}

Board.prototype.animation_complete = function(gem){
  console.log("ANIMATION DONE");
  console.log(gem);
}


Board.prototype.swap_gem = function(gem, vector, check_gem_position=true){
  var new_position = [gem.pos_x + vector[0], gem.pos_y + vector[1]]
  var other_gem = this.find_gem_by_position(new_position);

  // this might have to happen at the same time as the other gem move, like a 
  // transaction. Could just rely on first shape always completing first...
  this.move_gem(gem, vector);

  var reverse_vector = [-vector[0], -vector[1]];

  var _this = this;
  this.move_gem(other_gem, reverse_vector, function(){
    _this.process_swap(gem, other_gem, reverse_vector, check_gem_position);
  });
}

Board.prototype.process_swap = function(gem, other_gem, reverse_vector, check_gem_position=true){
  var _this = this;

  if (check_gem_position) {
    var matching_shapes = this.matching_shapes([gem, other_gem]);
    if (matching_shapes.length > 0) {
      console.log("Valid move");
      setTimeout(function(){
        _this.remove_shapes(matching_shapes);
        _this.refill_board();
      },
      150);
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
  // return [];

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

Board.prototype.add_new_gem_to_top = function(x){
  var color = _.sample(this.gem_types);
  var gem = new Gem(color, x, -1);
  this.move_gem(gem, [0,1])
  return gem;
}

Board.prototype.add_new_gems_to_top = function(){
  for(var x = 0; x < this.width; x++){
    gem = this.find_gem_by_position([x, 0]);
    if (gem == null){
      var new_gem = this.add_new_gem_to_top(x);

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
          // this.move_gem(gem, [0,1]);
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
// 
