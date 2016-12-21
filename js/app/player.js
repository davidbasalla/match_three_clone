var Player = function (name, max_hitpoints){
  this.name = name;
  this.max_hitpoints = max_hitpoints;
  this.hitpoints = max_hitpoints;
  this.matched_gems = {};
};

Player.prototype.is_dead = function() {
  this.hitpoints <= 0;
}
