var Game = function (map, logger) {
  this.map = map;
  this.logger = logger;

  this.selected_gem = null;
  this.move_vector = null;
  this.src_pos = null;
  this.dst_pos = null;
  this.turn_count = 1;
  this.input_blocked = false;

  this.CANVAS_ID = 'c'
  this.global_render_id = 0

  // set up canvas and handlers
  // weird that the canvas is here? this is display logic, firmly mixed into
  // the game logic
  var _this = this;
  this.canvas = new fabric.Canvas(this.CANVAS_ID);
  this.canvas.on('mouse:down', function(event){_this.handle_mouse_down(event)});
  this.canvas.on('mouse:up', function(event){_this.handle_mouse_up(event)});

  var parsed_map = MapParser.parse(this.map);
  this.board = new Board(parsed_map["width"], 
                         parsed_map["height"], 
                         parsed_map["gems"], 
                         this.canvas,
                         this.logger);

  // necessary to bind here to keep Game scope when triggered
  var score_callback = this.update_score_display.bind(this)
  var turn_callback = this.end_turn.bind(this)
  var reset_turn_callback = this.reset_turn.bind(this)
  this.gem_manipulator = new GemManipulator(this.board, this.canvas, this.logger, score_callback, turn_callback, reset_turn_callback);
};

Game.prototype.start = function(){
  this.board.draw();
};

Game.prototype.start_turn = function(selected_gem, move_vector){
  this.start_animation()
  this.gem_manipulator.swap(selected_gem, move_vector);
}

Game.prototype.end_turn = function(){
  this.reset_turn()

  this.turn_count += 1;
  this.update_turn_display()
}

Game.prototype.reset_turn = function(){
  this.stop_animation()
  this.input_blocked = false;
}

Game.prototype.handle_mouse_down = function(event){
  this.src_pos = this.mouse_position(event);
  this.selected_gem = this.find_gem_by_screen_position(this.src_pos);
}

Game.prototype.handle_mouse_up = function(event){
  if (this.input_blocked){ return }

  this.dst_pos = this.mouse_position(event);

  var move_vector = this.calculate_move_vector();
  if(this.selected_gem && move_vector){
    this.start_turn(this.selected_gem, move_vector)
  }

  this.selected_gem = null;
  this.input_blocked = true;
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

Game.prototype.find_gem_by_screen_position = function(position) {
  var normalised_pos = [Math.floor(position[0]/50), Math.floor(position[1]/50)];
  return this.board.find_gem_by_position(normalised_pos);
}

Game.prototype.update_score_display = function(){
  document.getElementById('score').innerHTML = this.gem_manipulator.matched_gem_counter.count();

  var matches = this.gem_manipulator.matched_gem_counter.matched_gems;
  document.getElementById('gem-type-0').innerHTML = matches[0];
  document.getElementById('gem-type-1').innerHTML = matches[1];
  document.getElementById('gem-type-2').innerHTML = matches[2];
  document.getElementById('gem-type-3').innerHTML = matches[3];
  document.getElementById('gem-type-4').innerHTML = matches[4];
  document.getElementById('gem-type-5').innerHTML = matches[5];
}

Game.prototype.update_turn_display = function(){
  document.getElementById('turn').innerHTML = this.turn_count;
}

Game.prototype.start_animation = function(){
  var _this = this;
  function render_loop() {
    _this.canvas.renderAll()
    _this.global_render_id = requestAnimationFrame(render_loop);
  }
  this.global_render_id = requestAnimationFrame(render_loop);
}

Game.prototype.stop_animation = function(){
  cancelAnimationFrame(this.global_render_id);
}
