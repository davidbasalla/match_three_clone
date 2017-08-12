var Board = function (width, height, gems, canvas, logger) {
  this.width = width;
  this.height = height;
  this.gems = gems || [];
  this.canvas = canvas;
  this.logger = logger;
};

Board.prototype.draw = function() {
  _this = this;
  _.each(this.gems, function(gem) {
    _this.canvas.add(gem.shape);
  })
}

Board.prototype.find_gem_by_position = function(position){
  return _.find(this.gems, function(gem){ 
    return (gem.pos_x == position[0] && gem.pos_y == position[1]);
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

Board.prototype.space_below_gem_is_free = function(gem){
  return this.space_below_is_free(gem.position())
}

Board.prototype.space_below_is_free = function(position){
  if(position[1] == (this.height - 1)){ return false; }
  if(this.find_gem_by_position([position[0], position[1] + 1])){ return false; }
  return true;
}
