import Shape from './shape'
import _ from 'lodash';

class MatchingShapeFinder {
  constructor(board, logger){
    this.board = board;
    this.logger = logger;
  }

  matching_shapes(gems){
    // this.logger.info('MATCHING SHAPES')

    var shapes = [];

    var _this = this;
    _.each(gems, function(gem){
      var shape = _this.matching_shape_for(gem);
      if (shape) {
        shapes.push(shape);
      }
    })

    return this.unique_shapes(shapes);
  }

  matching_shape_for(gem){
    var matching_shape = null;
    var matching_gems = [];

    var horizontal_gems = this.matching_gems(gem, "horizontal");
    if (horizontal_gems.length > 0) {
      matching_gems = matching_gems.concat(horizontal_gems);
    }

    var vertical_gems = this.matching_gems(gem, "vertical");
    if (vertical_gems.length > 0) {
      matching_gems = matching_gems.concat(vertical_gems);
    }

    if (matching_gems.length > 0){
      matching_shape = new Shape(_.uniq(matching_gems));
    }

    return matching_shape;
  }

  matching_gems(gem, horizontal_or_vertical){
    var matching_gems = [gem];

    if (horizontal_or_vertical == "horizontal"){
      vector_1 = [0, 1]
      vector_2 = [0, -1]
    }
    else {
      vector_1 = [1, 0]
      vector_2 = [-1, 0]
    }

    matching_gems = matching_gems.concat(this.walk_matching_gems(gem, vector_1));
    matching_gems = matching_gems.concat(this.walk_matching_gems(gem, vector_2));

    // clear gems if not more than 3
    if (matching_gems.length < 3){
      matching_gems = [];
    }

    return matching_gems;
  }

  walk_matching_gems(gem, vector){
    var position = gem.position();
    var matching_gems = [];
    position[0] += vector[0];
    position[1] += vector[1];

    var next_gem = this.board.find_gem_by_position(position);

    while(next_gem && 
          next_gem.color == gem.color &&
          next_gem.pos_y >= 0){
      matching_gems.push(next_gem);
      position[0] += vector[0];
      position[1] += vector[1];
      next_gem = this.board.find_gem_by_position(position);
    }

    return matching_gems;
  }

  unique_shapes(shapes){
    var unique_shapes = []

    var _this = this;
    _.each(shapes, function(shape){
      if(!_this.shape_included_in_shapes(shape, unique_shapes)){
        unique_shapes.push(shape);
      }
    })

    return unique_shapes;
  }

  shape_included_in_shapes(original_shape, shapes){
    for(var i = 0; i < shapes.length; i++){
      if(shapes[i].equals(original_shape)) {
        return true;
      }
    }

    return false;
  }
}

export default MatchingShapeFinder;
