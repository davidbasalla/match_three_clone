import { fabric } from 'fabric'

class Gem {
  constructor(color, pos_x, pos_y, type) {
    this.color = color;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.width = 45;
    this.height = 45;
    this.type = type;
  
    this.movement_vector = { x: 0, y: 0 };
    this.mouse_start_pos = { x: null, y: null };
    this.mouse_end_pos = { x: null, y: null };
    this.mouse_down = false;
  
    this.calculate_movement_vector_y = 0;
  
    this.shape = new fabric.Rect({
      left: this.pos_x * 50,
      top: this.pos_y * 50,
      fill: this.color,
      width: this.width,
      height: this.height,
      selectable: false,
    });
  }

  position() {
    return [this.pos_x, this.pos_y];
  }
  
  // would be cool if rendering the cubes was more declarative...
  
  move(vector) {
    this.pos_x += vector[0];
    this.pos_y += vector[1];
  
    this.shape.set({left: this.pos_x * 50, top: this.pos_y * 50})
  };

  static colors() {
    const basicColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const pastelColors = ["#e998b3", "#c2d2e0", "#d69e85", "#f2d299",  "#c7c491", "#bae6d1"];
    return pastelColors;
  }

  static random_gem(x, y, seed) {
    var gem_type = seed % this.colors().length;
    var color = this.colors()[gem_type];
  
    return new this(color, x, y, gem_type);
  }
}

export default Gem;
