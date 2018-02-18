import Gem from "./gem";

class MapParser {
  static parse(mapfile) {
    var height = mapfile.length;
    var width = mapfile[0].length;
    var gems = [];
    var gem_colors = Gem.colors();

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var gem_type = mapfile[y][x];
        var color = gem_colors[gem_type];

        gems.push(new Gem(color, x, y, gem_type));
      }
    }

    return {
      height: height,
      width: width,
      gems: gems
    };
  }
}

export default MapParser;
