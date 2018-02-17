requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'src/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

requirejs(["underscore", 
           "fabric",
           "app/game",
           "app/board",
           "app/gem", 
           "app/shape",
           "app/map_parser",
           "app/map",
           "app/matched_gem_counter",
           "app/gem_manipulator",
           "app/matching_shape_finder",
           "app/logger"], 
           function(game, board, gem, shape, map_parser, map, matched_gem_counter, gem_manipulator, matching_shape_finder, logger) {
  //This function is called when scripts/helper/util.js is loaded.
  //If util.js calls define(), then this function is not fired until
  //util's dependencies have loaded, and the util argument will hold
  //the module value for "helper/util".

  console.log('Program starts...');

  var logger = new Logger(true);
  var game = new Game(Map.map_default(), logger);
  game.start();
});
