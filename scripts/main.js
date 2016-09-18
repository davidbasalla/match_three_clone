requirejs(["underscore", "fabric", "game", "board", "gem"], function(game, board, gem) {
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
