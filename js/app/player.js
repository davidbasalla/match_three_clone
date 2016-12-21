var Player = function (name, max_hitpoints){
  this.name = name;
  this.max_hitpoints = max_hitpoints;
  this.hitpoints = max_hitpoints;
  this.matched_gems = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }
};

Player.prototype.is_dead = function() {
  this.hitpoints <= 0;
}

Player.prototype.add_gems = function(gems) {
  this.matched_gems[0] += gems[0]
  this.matched_gems[1] += gems[1]
  this.matched_gems[2] += gems[2]
  this.matched_gems[3] += gems[3]
  this.matched_gems[4] += gems[4]
  this.matched_gems[5] += gems[5]
}
