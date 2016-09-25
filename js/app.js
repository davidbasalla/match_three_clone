requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
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
           "app/shape"], 
           function(game, board, gem, shape) {
  //This function is called when scripts/helper/util.js is loaded.
  //If util.js calls define(), then this function is not fired until
  //util's dependencies have loaded, and the util argument will hold
  //the module value for "helper/util".

  console.log('Program starts...');

  var width = 10;
  var height = 10;

  var new_game = new Game(width, height);
  new_game.start();
});
