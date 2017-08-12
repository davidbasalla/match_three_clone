var Game = function (map) {
  this.selected_gem = null;
  this.move_vector = null;
  this.src_pos = null;
  this.dst_pos = null;

  this.CANVAS_ID = 'c'

  // set up canvas and handlers
  // weird that the canvas is here? this is display logic, firmly mixed into
  // the game logic
  var _this = this;
  this.canvas = new fabric.Canvas(this.CANVAS_ID);
  this.canvas.on('mouse:down', function(event){_this.handle_mouse_down(event)});
  this.canvas.on('mouse:up', function(event){_this.handle_mouse_up(event)});

  // necessary to bind here to keep Game scope when triggered
  var callback = this.process_event.bind(this)

  var parsed_map = MapParser.parse(map);
  this.board = new Board(parsed_map["width"], 
                         parsed_map["height"], 
                         parsed_map["gems"], 
                         this.canvas, 
                         callback);
};

Game.prototype.start = function(){
  this.board.draw();
};

Game.prototype.handle_mouse_down = function(event){
  this.src_pos = this.mouse_position(event);
  this.selected_gem = this.board.find_gem_by_screen_position(this.src_pos);
}

Game.prototype.handle_mouse_up = function(event){
  this.dst_pos = this.mouse_position(event);

  var move_vector = this.calculate_move_vector();
  if(this.selected_gem && move_vector){
    this.board.swap_gem(this.selected_gem, move_vector);
  }

  this.selected_gem = null;
}

Game.prototype.mouse_position = function(event) {
  var element = document.getElementById(this.CANVAS_ID)
  var canvas_offset = element.getBoundingClientRect();

  var x = event.e.clientX - canvas_offset['left'];
  var y = event.e.clientY - canvas_offset['top'];
  return [x, y]
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
  document.getElementById('score').innerHTML = this.board.matched_gem_counter.count();

  var matches = this.board.matched_gem_counter.matched_gems;
  document.getElementById('gem-type-0').innerHTML = matches[0];
  document.getElementById('gem-type-1').innerHTML = matches[1];
  document.getElementById('gem-type-2').innerHTML = matches[2];
  document.getElementById('gem-type-3').innerHTML = matches[3];
  document.getElementById('gem-type-4').innerHTML = matches[4];
  document.getElementById('gem-type-5').innerHTML = matches[5];
}

