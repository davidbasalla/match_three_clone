var Map = function () {};

Map.prototype.map_1 = function() {
  var map = 
  [
    [0,1,2],
    [1,2,0],
    [2,0,2],
  ];

  return map;
};

Map.prototype.map_2 = function() {
  var map = 
  [
    [2],
    [1],
    [0],
    [2],
    [0],
    [1],
    [0],
    [0],
  ];

  return map;
};

Map.prototype.map_3 = function() {
  var map = 
  [
    [1,2,0,1],
    [1,2,0,1],
    [0,1,1,1],
    [1,2,0,1],
    [2,0,2,0],
  ];

  return map;
};

Map.prototype.map_default = function() {
  var map = 
  [
    [0,1,2,3,4,5,0,1,2,3],
    [1,2,3,4,5,0,1,2,3,5],
    [2,3,4,5,0,1,2,3,0,2],
    [0,1,2,3,4,5,0,1,2,3],
    [5,3,2,0,1,2,3,4,5,0],
    [0,2,0,4,3,4,5,5,1,2],
    [0,1,2,3,4,5,0,3,2,4],
    [1,3,0,1,2,3,4,5,0,1],
    [0,1,1,3,4,0,0,1,2,3],
    [4,1,2,2,0,5,0,1,2,3],
  ];


  return map;
};
