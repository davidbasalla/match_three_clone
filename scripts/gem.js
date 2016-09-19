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

  this.shape.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mtr: false,
  });

  // problem here as doesnt seem to update, because its not moving maybe?
  this.shape.on('mousemove', function(e) {
    console.log('mousemove on rectangle');
    console.log(this.mouse_down);
  });

  this.shape.on('mousedown', function(e) {
    console.log('mousedown on rectangle');
    e.target.lockMovementX = true;
    e.target.lockMovementY = true;
  });

  this.shape.on('mouseup', function(e) {
    console.log('mouseup on rectangle');
    e.target.lockMovementX = false;
    e.target.lockMovementY = false;
  });
};

Gem.prototype.calculate_movement_vector = function() {

}
