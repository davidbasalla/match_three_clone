var Shape = function (gems = []) {
  this.gems = []
};

Shape.prototype.is_present = function() {
  if(_this.gems.length > 0){ return true; }
  return false;
};

Shape.prototype.remove = function() {
  console.log("REMOVING SHAPE");
};
