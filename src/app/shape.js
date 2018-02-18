class Shape {
  constructor(gems=[]) {
    this.gems = gems;
  };

  equals(shape){
    // Return true if same object
    if (this == shape){
      return true;
    }
  
    // Return true if gems match
    if (this.gems_match(this.gems, shape.gems)){
      return true;
    }
  
    return false;
  }
  
  gems_match(gems, other_gems){
    if(gems.length != other_gems.length) {
      return false;
    }
  
    if (_.difference(gems, other_gems).length > 0 || 
        _.difference(other_gems, gems).length > 0){
      return false;
    }
  
    return true;
  }
}

export default Shape;
