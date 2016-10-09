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

Board.prototype.move_gem = function(gem, vector, delay=0){
  var _this = this;
  return new Promise(function(resolve, reject){
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

    // duration matches the distance travelled so to have similar speed

    setTimeout(function(){
      gem.shape.animate(move_attr, move_amplitude, { 
        onChange: _this.canvas.renderAll.bind(_this.canvas),
        onComplete: resolve,
        duration: 100 * Math.max(Math.abs(vector_x), Math.abs(vector_y)),
      });
    },
    delay)
  })
}

Board.prototype.swap_gem = function(gem, vector, check_gem_position=true){
  var new_position = [gem.pos_x + vector[0], gem.pos_y + vector[1]]
  var other_gem = this.find_gem_by_position(new_position);
  var reverse_vector = [-vector[0], -vector[1]];

  var move_promises = [
    this.move_gem(gem, vector),
    this.move_gem(other_gem, reverse_vector),
  ];

  var _this = this;
  Promise.all(move_promises).then(function(){
    _this.process_swap(gem, other_gem, reverse_vector, check_gem_position);
  })
}

Board.prototype.process_swap = function(gem, other_gem, reverse_vector, check_gem_position=true){
  var _this = this;

  if (check_gem_position) {
    var matching_shapes = this.matching_shapes([gem, other_gem]);
    if (matching_shapes.length > 0) {
      this.remove_shapes(matching_shapes).then(function(){
        _this.refill_board();
      });
    }
    else {
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

  // need to remove duplicate shapes - WIP
  // could merge combined shapes here

  // return shapes
  return this.unique_shapes(shapes);
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
  var _this = this;
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      _.each(shapes, function(shape){
        _.each(shape.gems, function(gem) {
          var index = _this.gems.indexOf(gem);
          _this.gems.splice(index, 1);

          _this.canvas.remove(gem.shape);
          resolve()
        })
      })
    },
    100)
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
  var _this = this;

  this.apply_gravity().then(function(){
    if(_this.top_row_has_missing_gems()){
      _this.add_new_gems_to_top()
        .then(function(){
          return _this.remove_shapes(_this.matching_shapes(_this.gems));
        })
        .then(function(){
          _this.refill_board();
        })
    }
  })
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
  var _this = this;
  return new Promise(function(resolve, reject){
    var move_promises = []
    var delay = 0;

    for(var x = 0; x < _this.width; x++){
      for(var y = _this.height; y >= 0; y--){
        gem = _this.find_gem_by_position([x, y]);
        if (gem == null){
          move_promises.push(_this.add_new_gem_to_top(x, delay));
          delay += 100;
        }
      }
      delay = 0;
    }

    // issue here that dropping gems happens all at the same time
    // any way to delay this somehow? Would need to separate into per columns
    Promise.all(move_promises).then(function(){
      resolve()
    })
  })
}

Board.prototype.add_new_gem_to_top = function(x, delay){
  var _this = this;
  return new Promise(function(resolve, reject){
    var color = _.sample(_this.gem_types);
    var gem = new Gem(color, x, -1);

    _this.gems.push(gem);
    _this.canvas.add(gem.shape);

    _this.drop_gem(gem, delay).then(function(){
      resolve()
    })
  })
}

// seems expensive to query each time, should use 2D array for storage
Board.prototype.apply_gravity = function(){
  var _this = this;
  return new Promise(function(resolve, reject){
    var move_promises = [];
    var gem = null;

    for(var x = 0; x < _this.width; x++){
      for(var y = _this.height; y >= 0; y--){
        gem = _this.find_gem_by_position([x, y]);
        if (gem){
          if(_this.space_below_gem_is_free(gem)){
            move_promises.push(_this.drop_gem(gem))
          }
        }
      }
    }

    Promise.all(move_promises).then(function(){
      resolve();
    })
  })
}

Board.prototype.drop_gem = function(gem, delay=0){
  var _this = this;
  return new Promise(function(resolve, reject){
    var position = gem.position()

    while (_this.space_below_is_free(position)){
      position = [position[0], position[1] + 1]
    }
    var drop_by = (position[1] - gem.position()[1])

    _this.move_gem(gem, [0, drop_by], delay).then(function(){
      resolve();
    })
  });
}

Board.prototype.space_below_gem_is_free = function(gem){
  return this.space_below_is_free(gem.position())
}

Board.prototype.space_below_is_free = function(position){
  if(position[1] == (this.height - 1)){ return false; }
  if(this.find_gem_by_position([position[0], position[1] + 1])){ return false; }
  return true;
}

Board.prototype.unique_shapes = function(shapes){
  var unique_shapes = []

  var _this = this;
  _.each(shapes, function(shape){
    if(!_this.shape_included_in_shapes(shape, unique_shapes)){
      unique_shapes.push(shape);
    }
  })

  return unique_shapes;
}

Board.prototype.shape_included_in_shapes = function(original_shape, shapes){
  for(var i = 0; i < shapes.length; i++){
    if(shapes[i].equals(original_shape)) {
      return true;
    }
  }

  return false;
}
