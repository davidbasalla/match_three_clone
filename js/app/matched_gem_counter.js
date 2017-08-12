var MatchedGemCounter = function() {
  // currently a hard coded list, could make more dynamic
  this.matched_gems = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }

  this._gem_count = 0;
}

MatchedGemCounter.prototype.update = function(gem) {
  this.matched_gems[gem.type] += 1;
  this._gem_count += 1;
}

MatchedGemCounter.prototype.count = function() {
  return this._gem_count;
}
