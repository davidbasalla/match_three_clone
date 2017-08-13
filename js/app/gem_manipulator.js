// This class handles all gem manipulation

var GemManipulator = function(board, canvas, logger, matched_gems_callback, turn_callback){
  this.board = board;
  this.canvas = canvas;
  this.logger = logger;
  this.matched_gems_callback = matched_gems_callback;
  this.turn_callback = turn_callback;

  this.matched_gem_counter = new MatchedGemCounter;
}

GemManipulator.prototype.swap = function(gem, vector, check_gem_position){
  this.logger.info("SWAP")

  var new_position = [gem.pos_x + vector[0], gem.pos_y + vector[1]]
  var other_gem = this.board.find_gem_by_position(new_position);
  var reverse_vector = [-vector[0], -vector[1]];

  var move_promises = [
    this.move_gem(gem, vector),
    this.move_gem(other_gem, reverse_vector),
  ];

  // start animation
  var globalID;
  var _this = this;
  function repeatOften() {
    _this.canvas.renderAll()
    globalID = requestAnimationFrame(repeatOften);
  }
  globalID = requestAnimationFrame(repeatOften);

  Promise.all(move_promises).then(function(){
    // stop animation
    cancelAnimationFrame(globalID);

    // need to add the first gem back in, as the swap wiped the the key entry
    _this.board.matrix[gem.pos_x][gem.pos_y] = gem

    _this.validate_swap(gem, other_gem, reverse_vector, check_gem_position);
  })
}

GemManipulator.prototype.move_gem = function(gem, vector, delay=0){
  // this.logger.info("MOVE GEM")

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

    var old_pos = [gem.pos_x, gem.pos_y]

    gem.pos_x += vector_x;
    gem.pos_y += vector_y;

    var new_pos = [gem.pos_x, gem.pos_y]

    _this.board.update_matrix(gem, old_pos, new_pos)

    // duration matches the distance traveled so to have similar speed
    setTimeout(function(){
      gem.shape.animate(move_attr, move_amplitude, { 
        onComplete: resolve,
        duration: 100 * Math.max(Math.abs(vector_x), Math.abs(vector_y)),
      });
    },
    delay)
  })
}

GemManipulator.prototype.validate_swap = function(gem, other_gem, reverse_vector, check_gem_position=true){
  this.logger.info('PROCESS SWAP')
  // this either starts off the main loop or reverses the swap

  if (!check_gem_position){
    return 
  }

  var matching_shapes = this.board.matching_shapes([gem, other_gem]);
  if (matching_shapes.length > 0) {
    this.process_board_state(matching_shapes);
  }
  else {
    this.swap(gem, reverse_vector, false);
  };

  this.canvas.renderAll();
}

GemManipulator.prototype.process_board_state = function(matching_shapes){
  this.logger.info('PROCESS BOARD STATE')
  // this is the main recursive loop that handles cascading gem matches

  // start animation
  var globalID;
  var _this = this;
  function repeatOften() {
    _this.canvas.renderAll()
    globalID = requestAnimationFrame(repeatOften);
  }
  globalID = requestAnimationFrame(repeatOften);

  if (matching_shapes.length > 0){
    var _this = this;
    this.remove_shapes(matching_shapes)
      .then(this.drop_and_refill.bind(this))
      .then(function(){
        _this.process_board_state(_this.board.matching_shapes(_this.board.active_gems()))
      })

  }
  else {
    // stop animation
    cancelAnimationFrame(globalID);

    this.logger.info("TURN IS FINISHED")
    this.turn_callback()
  }
}

GemManipulator.prototype.remove_shapes = function(shapes){
  this.logger.info("REMOVING SHAPE")
  var _this = this;

  _.each(shapes, function(shape){
    _this.set_flashing_animation(shape)
  })

  return new Promise(function(resolve, reject){
    setTimeout(function(){
      _.each(shapes, function(shape){
        _.each(shape.gems, function(gem) {
          _this.board.remove_gem(gem);
          _this.matched_gem_counter.update(gem);

          resolve()
        })
      _this.matched_gems_callback();
      })
    },
    500)
  })
}

GemManipulator.prototype.set_flashing_animation = function(shape){
  var _this = this;
  _.each(shape.gems, function(gem) {
    gem.shape.animate('opacity', '0', { 
      onChange: _this.canvas.renderAll.bind(_this.canvas),
      easing: fabric.util.ease.easeInBounce
    });
  })
}

GemManipulator.prototype.drop_and_refill = function(){
  this.logger.info("DROP AND REFILL")
  var _this = this;

  return new Promise(function(resolve, reject){
    _this.apply_gravity()
      .then(function(){
        _this.board.fill_overhead_space(_this.matched_gem_counter.count());
        resolve()
      })
  })
}

GemManipulator.prototype.apply_gravity = function(){
  this.logger.info("APPLY GRAVITY")

  var _this = this;
  return new Promise(function(resolve, reject){
    var move_promises = [];

    // Not sure how or why this works... :/
    for(var x = 0; x < _this.board.width; x++){
      for(var y = _this.board.height; y >= -(_this.board.height); y--){
        gem = _this.board.find_gem_by_position([x, y]);
        if (gem){
          if(_this.board.space_below_gem_is_free(gem)){
            move_promises.push(_this.drop_gem(gem))
          }
        }
      }
    }

    Promise.all(move_promises).then(resolve)
  })
}

GemManipulator.prototype.drop_gem = function(gem, delay=0){
  var _this = this;
  return new Promise(function(resolve, reject){
    var position = gem.position()

    while (_this.board.space_below_is_free(position)){
      position = [position[0], position[1] + 1]
    }
    var drop_by = (position[1] - gem.position()[1])

    _this.move_gem(gem, [0, drop_by], delay).then(resolve)
  });
}
