var MapParser = function (mapfile) {
  this.mapfile = mapfile;
  this.height = this.mapfile.length;
  this.width = this.mapfile[0].length;
};

MapParser.prototype.parse = function() {
  var gems = [];
  var gem = null;

  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      var coord = this.mapfile[y][x];
      var identifier = coord[0];

      switch (identifier) {
        case 'R':
          gem = new Gem('red', x, y);
          break;
        case 'G':
          gem = new Gem('green', x, y);
          break;
        case 'B':
          gem = new Gem('blue', x, y);
          break;
        default:
          gem = null;
          break;
      }
      if (gem) {
        gems.push(gem);
      }
    }
  }

  return {
    gems: gems,
    height: this.height,
    width: this.width,
  }
};
