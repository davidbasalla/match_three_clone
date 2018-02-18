import { fabric } from 'fabric'
import React from 'react'
import ReactDOM from 'react-dom'

import Board from './board'
import GemManipulator from './gem_manipulator'
import MapParser from './map_parser'
import ScoreDisplay from './ScoreDisplay'

class Game {
  constructor (map, logger) {
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

    this.update_score_display();
  }

  start() {
    this.board.draw();
  };

  start_turn(selected_gem, move_vector){
    this.start_animation()
    this.gem_manipulator.swap(selected_gem, move_vector);
  }

  end_turn() {
    this.reset_turn()

    this.turn_count += 1;
    this.update_score_display()
  }

  reset_turn() {
    this.stop_animation()
    this.input_blocked = false;
  }

  handle_mouse_down(event){
    this.src_pos = this.mouse_position(event);
    this.selected_gem = this.find_gem_by_screen_position(this.src_pos);
  }

  handle_mouse_up(event){
    if (this.input_blocked){ return }

    this.dst_pos = this.mouse_position(event);

    var move_vector = this.calculate_move_vector();
    if(this.selected_gem && move_vector){
      this.start_turn(this.selected_gem, move_vector)
    }

    this.selected_gem = null;
    this.input_blocked = true;
  }

  mouse_position(event) {
    var element = document.getElementById(this.CANVAS_ID)
    var canvas_offset = element.getBoundingClientRect();

    var x = event.e.clientX - canvas_offset['left'];
    var y = event.e.clientY - canvas_offset['top'];
    return [x, y]
  }

  calculate_move_vector() {
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

  find_gem_by_screen_position(position) {
    var normalised_pos = [Math.floor(position[0]/50), Math.floor(position[1]/50)];
    return this.board.find_gem_by_position(normalised_pos);
  }

  update_score_display() {
    console.log("UPDATE")

    ReactDOM.render(
      <ScoreDisplay 
        count={ this.gem_manipulator.matched_gem_counter.count() }
        matches={ this.gem_manipulator.matched_gem_counter.matched_gems }
        turn={this.turn_count}
      />,
      document.getElementById('matched-gems-display')
    );
  }

  start_animation() {
    var _this = this;
    function render_loop() {
      _this.canvas.renderAll()
      _this.global_render_id = requestAnimationFrame(render_loop);
    }
    this.global_render_id = requestAnimationFrame(render_loop);
  }

  stop_animation() {
    cancelAnimationFrame(this.global_render_id);
  }
}

export default Game;
