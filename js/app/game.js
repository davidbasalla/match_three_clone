var Game = function (width, height, map) {
  this.width = width;
  this.height = height;

  this.selected_gem = null;
  this.move_vector = null;
  this.src_pos = null;
  this.dst_pos = null;

  this.CANVAS_ID = 'c'

  // set up canvas and handlers
  var _this = this;
  this.canvas = new fabric.Canvas(this.CANVAS_ID);
  this.canvas.on('mouse:down', function(event){_this.handle_mouse_down(event)});
  this.canvas.on('mouse:up', function(event){_this.handle_mouse_up(event)});

  // necessary to bind here to keep Game scope when triggered
  var callback = this.process_event.bind(this)
  this.board = new Board(this.width, this.height, this.canvas, map, callback);
};

Game.prototype.start = function(){
  this.draw();
};

Game.prototype.draw = function(){
  this.board.draw();
}

Game.prototype.handle_mouse_down = function(event){
  var element = document.getElementById(this.CANVAS_ID)
  var canvas_offset = element.getBoundingClientRect();

  this.src_pos = [
    event.e.clientX - canvas_offset['left'],
    event.e.clientY - canvas_offset['top']
  ]
  this.selected_gem = this.board.find_gem_by_screen_position(this.src_pos);
}

Game.prototype.handle_mouse_up = function(event){
  var element = document.getElementById(this.CANVAS_ID)
  var canvas_offset = element.getBoundingClientRect();

  this.dst_pos = [
    event.e.clientX - canvas_offset['left'],
    event.e.clientY - canvas_offset['top']
  ];

  var move_vector = this.calculate_move_vector();
  if(this.selected_gem && move_vector){
    this.board.swap_gem(this.selected_gem, move_vector);
  }

  this.selected_gem = null;
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

Game.prototype.process_event = function(){
  document.getElementById('score').innerHTML = this.board.score;

  document.getElementById('gem-type-0').innerHTML = this.board.matched_gems[0];
  document.getElementById('gem-type-1').innerHTML = this.board.matched_gems[1];
  document.getElementById('gem-type-2').innerHTML = this.board.matched_gems[2];
  document.getElementById('gem-type-3').innerHTML = this.board.matched_gems[3];
  document.getElementById('gem-type-4').innerHTML = this.board.matched_gems[4];
  document.getElementById('gem-type-5').innerHTML = this.board.matched_gems[5];
}

