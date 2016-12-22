var Game = function (width, height, map) {
  this.width = width;
  this.height = height;

  this.CANVAS_ID = 'c'

  this.selected_gem = null;
  this.move_vector = null;
  this.src_pos = null;
  this.dst_pos = null;

  // set up canvas and handlers
  var _this = this;
  this.canvas = new fabric.Canvas(this.CANVAS_ID);
  this.canvas.on('mouse:down', function(event){_this.handle_mouse_down(event)});
  this.canvas.on('mouse:up', function(event){_this.handle_mouse_up(event)});

  // necessary to bind here to keep Game scope when triggered
  var score_callback = this.process_event.bind(this)
  var player_turn_callback = this.process_player_turn.bind(this)

  this.setup_players();
  this.board = new Board(this.width, this.height, this.canvas, map, score_callback, player_turn_callback);
};

Game.prototype.setup_players = function(){
  this.players = [
    new Player("goblin", 20),
    new Player("mage", 30)
  ]
  this.player_number = this.players.length;
  this.COMPUTER_PLAYER = this.players[1];

  this.turn_counter = 0;

  this.set_player_hitpoints(this.players[0])
  this.set_player_hitpoints(this.players[1])

  this.activate_player(this.players[0])
  this.deactivate_player(this.players[1])
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
  this.current_player.add_gems(this.board.matched_gems);
  this.update_gem_display(this.current_player)
}

Game.prototype.process_player_turn = function(){
  console.log("PLAYER TURN OVER")

  this.board.reset_matched_gems();

  this.turn_counter += 1;

  this.deactivate_player(this.current_player)
  this.activate_player(this.players[this.turn_counter % this.player_number])

  if (this.current_player == this.COMPUTER_PLAYER) {
    this.process_computer_player();
  }
}

Game.prototype.process_computer_player = function(){
  console.log("PROCESS COMPUTER PLAYER")

  _this = this;
  setTimeout(function(){ 
    var possible_move = _this.board.find_move();
    console.log(possible_move);
    _this.board.swap_gem(possible_move["gem"], possible_move["move_vector"]);
  }, 2000)
}

Game.prototype.update_gem_display = function(player){
  document.getElementById('gem-type-0-' + player.name).innerHTML = player.matched_gems[0];
  document.getElementById('gem-type-1-' + player.name).innerHTML = player.matched_gems[1];
  document.getElementById('gem-type-2-' + player.name).innerHTML = player.matched_gems[2];
  document.getElementById('gem-type-3-' + player.name).innerHTML = player.matched_gems[3];
  document.getElementById('gem-type-4-' + player.name).innerHTML = player.matched_gems[4];
  document.getElementById('gem-type-5-' + player.name).innerHTML = player.matched_gems[5];
}

Game.prototype.deactivate_player = function(player){
  document.getElementById(player.name + "-image").style.opacity = 0.5;
  document.getElementById(player.name).style.borderColor = "";
}

Game.prototype.activate_player = function(player){
  console.log("NEW PLAYER: " + player.name)
  this.current_player = player
  document.getElementById(player.name + "-image").style.opacity = 1;
  document.getElementById(player.name).style.borderColor = "lightgreen";
}

Game.prototype.set_player_hitpoints = function(player){
  document.getElementById("hitpoint-display-" + player.name).innerHTML = player.hitpoints;
}
