var Game = function (width, height) {
  this.width = width;
  this.height = height;

  this.selected_gem = null;
  this.move_vector = null;
  this.src_pos = null;
  this.dst_pos = null;

  this.canvas = new fabric.Canvas('c');

  var _this = this;

  this.canvas.on('mouse:down', function(event){
    _this.src_pos = [event.e.clientX, event.e.clientY]
    _this.selected_gem = _this.board.find_gem_by_screen_position(_this.src_pos);
  });

  this.canvas.on('mouse:up', function(event){
    _this.dst_pos = [event.e.clientX, event.e.clientY];

    var move_vector = _this.calculate_move_vector();
    if(_this.selected_gem && move_vector){
      _this.board.move_gem(_this.selected_gem, move_vector);
    }

    _this.selected_gem = null;
  });

  this.board = new Board(this.width, this.height, this.canvas);
};

Game.prototype.start = function(){
  this.draw();
};

Game.prototype.draw = function(){
  this.board.draw();
}

Game.prototype.calculate_move_vector = function(){
  var x_change = this.dst_pos[0] - this.src_pos[0];
  var y_change = this.dst_pos[1] - this.src_pos[1];

  // TODO - add checks against out of bounds move
  if (x_change || y_change){

    if(Math.abs(x_change) > Math.abs(y_change)){
      return [x_change / Math.abs(x_change), 0];
    }
    else{
      return [0, y_change / Math.abs(y_change)];
    }
  }
  else{
    return null;
  }
}
