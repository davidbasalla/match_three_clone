var MapParser = function (mapfile) {
  this.mapfile = mapfile;
  this.height = this.mapfile.length;
  this.width = this.mapfile[0].length;
};

MapParser.prototype.parse = function() {
  var gem_ids = [];

  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      gem_ids.push(this.mapfile[y][x]);
    }
  }

  return {
    gem_ids: gem_ids,
    height: this.height,
    width: this.width,
  }
};
