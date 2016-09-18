var Gem = function (color, pos_x, pos_y) {
  this.color = color;
  this.pos_x = pos_x;
  this.pos_y = pos_y;
  this.width = 45;
  this.height = 45;

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

  this.shape.on('selected', function() {
    console.log('selected a rectangle');
  });
};
