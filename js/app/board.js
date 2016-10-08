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
    gem.shape.animate(move_attr, move_amplitude, { 
      onChange: _this.canvas.renderAll.bind(_this.canvas),
      onComplete: resolve,
      duration: 500 * Math.max(Math.abs(vector_x), Math.abs(vector_y)),
    });
  })
}

Board.prototype.swap_gem = function(gem, vector, check_gem_position=true){
  var new_position = [gem.pos_x + vector[0], gem.pos_y + vector[1]]
  var other_gem = this.find_gem_by_position(new_position);
  var reverse_vector = [-vector[0], -vector[1]];

  // this might have to happen at the same time as the other gem move, like a 
  // transaction. Could just rely on first shape always completing first...
  var _this = this;
  this.move_gem(gem, vector)
    .then(function(){
      return _this.move_gem(other_gem, reverse_vector);
    })
    .then(function(){
      console.log("ALL ANIM DONE");
    })

  // var _this = this;
  // this.move_gem(other_gem, reverse_vector, function(){
  //   _this.process_swap(gem, other_gem, reverse_vector, check_gem_position);
  // });
}

Board.prototype.process_swap = function(gem, other_gem, reverse_vector, check_gem_position=true){
  var _this = this;

  if (check_gem_position) {
    var matching_shapes = this.matching_shapes([gem, other_gem]);
    if (matching_shapes.length > 0) {
      console.log("Valid move");

      // this should be happening without setTimeout
      setTimeout(function(){
        _this.remove_shapes(matching_shapes);
        // _this.refill_board();
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
  var _this = this;
  this.apply_gravity(function(){
    if(_this.top_row_has_missing_gems()){
      _this.add_new_gems_to_top(function(){
        // Remove shapes that have matched because of the drop
        setTimeout(function(){
          _this.remove_shapes(_this.matching_shapes(_this.gems));
          _this.refill_board();
        },
        150);
      });
    }
  });
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

Board.prototype.add_new_gems_to_top = function(callback_func){
  var animating = 0;

  for(var x = 0; x < this.width; x++){
    gem = this.find_gem_by_position([x, 0]);
    if (gem == null){
      animating++;
      var new_gem = this.add_new_gem_to_top(x, function(){
        animating--;
        if(animating == 0){
          console.log('CREATION complete')
          callback_func();
          return;
        }
      });

      this.gems.push(new_gem);
      this.canvas.add(new_gem.shape);
    }
  }
}

Board.prototype.add_new_gem_to_top = function(x, callback_func){
  var color = _.sample(this.gem_types);
  var gem = new Gem(color, x, -1);
  this.move_gem(gem, [0,1], callback_func)
  return gem;
}

// seems expensive to query each time, should use 2D array for storage
Board.prototype.apply_gravity = function(callback_func){
  var animating = 0;

  var gem = null;
  for(var x = 0; x < this.width; x++){
    for(var y = this.height; y >= 0; y--){
      gem = this.find_gem_by_position([x, y]);
      if (gem){
        if(this.space_below_gem_is_free(gem)){
          animating++;
          this.drop_gem(gem, function(){
            animating--;
            if(animating == 0){
              // console.log('ALL GEM ANIMATION complete')
              callback_func();
            }
          })
        }
      }
    }
  }
  callback_func();
}

Board.prototype.drop_gem = function(gem, callback_func){
  var position = gem.position()

  while (this.space_below_is_free(position)){
    position = [position[0], position[1] + 1]
  }
  var drop_by = (position[1] - gem.position()[1])

  this.move_gem(gem, [0, drop_by], callback_func)
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
    console.log('Checking:')
    console.log(shape)
    if(!_this.shape_included_in_shapes(shape, unique_shapes)){
      unique_shapes.push(shape);
    }
  })

  console.log('UNIQUE SHAPES ARE:')
  console.log(unique_shapes)
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
