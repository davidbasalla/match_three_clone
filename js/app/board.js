// This class deals with storing gems and allows for querying, adding and 
// removing gems

var Board = function (width, height, gems, canvas, logger) {
  this.width = width;
  this.height = height;
  this.gems = gems || [];
  this.canvas = canvas;
  this.logger = logger;

  this.initialise_matrix();
  this.fill_matrix();

  this.fill_overhead_space();
  this.matching_shape_finder = new MatchingShapeFinder(this, logger);
};

Board.prototype.initialise_matrix = function() {
  this.matrix = new Array(this.width);
  for (var i = 0; i < this.width; i++) {
    this.matrix[i] = new Array(this.height);
  }
}

Board.prototype.fill_matrix = function() {
  for (var i = 0; i < this.gems.length; i++) {
    var gem = this.gems[i];
    this.matrix[gem.pos_x][gem.pos_y] = gem;
  }
}

Board.prototype.active_gems = function() {
  return _.reject(this.gems, function(gem){ return gem.pos_y < 0; });
}

Board.prototype.fill_overhead_space = function() {
  this.logger.info("FILL OVERHEAD SPACE")

  for(var x = 0; x < this.width; x++){
    for(var y = 1; y <= this.height; y++){
      var gem = this.matrix[x][-y]
      if (!gem) {
        var index = x * this.width + y;
        var new_gem = Gem.random_gem(x, -(y), index)
        this.add_gem(new_gem)
      }
    }
  }
}

Board.prototype.draw = function() {
  var _this = this;
  _.each(this.active_gems(), function(gem) {
    _this.canvas.add(gem.shape);
  })
}

Board.prototype.find_gem_by_position = function(position){
  var x = position[0]
  var y = position[1]

  if ((x < 0 || x >= this.width) || 
      (y < -(this.height) || y >= this.height)){
    return
  }

  return this.matrix[x][y]
}

Board.prototype.update_matrix = function(gem, old_pos, new_pos){
  this.matrix[old_pos[0]][old_pos[1]] = null;
  this.matrix[new_pos[0]][new_pos[1]] = gem;
}

Board.prototype.space_below_gem_is_free = function(gem){
  return this.space_below_is_free(gem.position())
}

Board.prototype.space_below_is_free = function(position){
  if(position[1] == (this.height - 1)){ return false; }
  if(this.find_gem_by_position([position[0], position[1] + 1])){ return false; }
  return true;
}

Board.prototype.add_gem = function(gem) {
  this.gems.push(gem);
  this.canvas.add(gem.shape);
  this.matrix[gem.pos_x][gem.pos_y] = gem;
}

Board.prototype.remove_gem = function(gem) {
  var index = this.gems.indexOf(gem);
  this.gems.splice(index, 1);

  this.canvas.remove(gem.shape);
  this.matrix[gem.pos_x][gem.pos_y] = null;
}

Board.prototype.matching_shapes = function(gems){
  return this.matching_shape_finder.matching_shapes(gems);
}
