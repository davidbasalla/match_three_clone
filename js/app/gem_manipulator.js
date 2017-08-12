// This class handles all gem manipulation

var GemManipulator = function(board, canvas, logger, callback){
  this.board = board;
  this.canvas = canvas;
  this.logger = logger;
  this.callback = callback;

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

  var _this = this;
  Promise.all(move_promises).then(function(){
    _this.process_swap(gem, other_gem, reverse_vector, check_gem_position);
  })
}

GemManipulator.prototype.move_gem = function(gem, vector, delay=0){
  this.logger.info("MOVE GEM")

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

    // duration matches the distance traveled so to have similar speed
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

GemManipulator.prototype.process_swap = function(gem, other_gem, reverse_vector, check_gem_position=true){
  this.logger.info('PROCESS SWAP')

  if (check_gem_position) {
    var matching_shapes = this.board.matching_shapes([gem, other_gem]);
    if (matching_shapes.length > 0) {
      var _this = this;
      this.remove_shapes(matching_shapes).then(function(){
        _this.refill_board();
      });
    }
    else {
      this.swap(gem, reverse_vector, false);
    };
  }

  this.canvas.renderAll();
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
      _this.callback();
      })
    },
    1000)
  })
}

// move some of this to Gem class
GemManipulator.prototype.set_flashing_animation = function(shape){
  _.each(shape.gems, function(gem) {
    gem.shape.animate('opacity', '0', { 
      onChange: _this.canvas.renderAll.bind(_this.canvas),
      easing: fabric.util.ease.easeInBounce
    });
  })
}

GemManipulator.prototype.refill_board = function(){
  this.logger.info("REFILL")
  var _this = this;

  this.apply_gravity().then(function(){
    if(_this.board.top_row_has_missing_gems()){
      _this.add_new_gems_to_top()
        .then(function(){
          var filtered_gems = _.reject(_this.board.gems, function(gem){ return gem.pos_y < 0; });

          return _this.remove_shapes(_this.board.matching_shapes(filtered_gems));
        })
        .then(function(){
          _this.refill_board();
        })
    }
  })
}

GemManipulator.prototype.add_new_gems_to_top = function(){
  this.logger.info("ADD NEW GEMS TO TOP")

  var _this = this;
  return new Promise(function(resolve, reject){
    var move_promises = []
    var delay = 0;

    for(var x = 0; x < _this.board.width; x++){
      for(var y = (_this.board.height - 1); y >= 0; y--){
        gem = _this.board.find_gem_by_position([x, y]);
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

GemManipulator.prototype.add_new_gem_to_top = function(x, delay){
  this.logger.info("ADD NEW GEM TO TOP")

  var _this = this;
  return new Promise(function(resolve, reject){
    var gem = Gem.random_gem(x, -1, _this.board.gems.length);
    _this.board.add_gem(gem)

    _this.drop_gem(gem, delay).then(function(){
      resolve()
    })
  })
}

// seems expensive to query each time, should use 2D array for storage
GemManipulator.prototype.apply_gravity = function(){
  this.logger.info("APPLY GRAVITY")

  var _this = this;
  return new Promise(function(resolve, reject){
    var move_promises = [];

    // Not sure how or why this works... :/
    for(var x = 0; x < _this.board.height; x++){
      for(var y = _this.board.width; y >= 0; y--){
        gem = _this.board.find_gem_by_position([x, y]);
        if (gem){
          if(_this.board.space_below_gem_is_free(gem)){
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

GemManipulator.prototype.drop_gem = function(gem, delay=0){
  var _this = this;
  return new Promise(function(resolve, reject){
    var position = gem.position()

    while (_this.board.space_below_is_free(position)){
      position = [position[0], position[1] + 1]
    }
    var drop_by = (position[1] - gem.position()[1])

    _this.move_gem(gem, [0, drop_by], delay).then(function(){
      resolve();
    })
  });
}
