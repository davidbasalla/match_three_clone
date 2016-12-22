var Gem = function (color, pos_x, pos_y, type) {
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

  var imgElement = null;
  switch(this.type) {
      case 0:
          imgElement = document.getElementById('sword');
          break;
      case 1:
          imgElement = document.getElementById('health');
          break;
      case 2:
          imgElement = document.getElementById('poison');
          break;
      case 3:
          imgElement = document.getElementById('fire');
          break;
      case 4:
          imgElement = document.getElementById('lightning');
          break;
      case 5:
          imgElement = document.getElementById('water');
          break;
  }

  this.shape = new fabric.Image(imgElement, {
    left: this.pos_x * 50,
    top: this.pos_y * 50,
    width: this.width,
    height: this.height,
  });


  // this.shape = new fabric.Rect({
  //   left: this.pos_x * 50,
  //   top: this.pos_y * 50,
  //   fill: this.color,
  //   width: this.width,
  //   height: this.height,
  // });

  this.shape.selectable = false;
};


Gem.prototype.position = function() {
  return [this.pos_x, this.pos_y];
}

Gem.prototype.move = function(vector) {
  this.pos_x += vector[0];
  this.pos_y += vector[1];


  this.shape.set({left: this.pos_x * 50, top: this.pos_y * 50})
};
