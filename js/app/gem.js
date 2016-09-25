var Gem = function (color, pos_x, pos_y) {
  this.color = color;
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.width = 45;
  this.height = 45;

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
  });

  this.shape.selectable = false;
};


// would be cool if rendering the cubes was more declarative...

Gem.prototype.move = function(vector) {
  this.pos_x += vector[0];
  this.pos_y += vector[1];

  this.shape.set({left: this.pos_x * 50, top: this.pos_y * 50})
};
