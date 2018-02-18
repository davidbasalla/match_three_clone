class MatchedGemCounter {
  constructor (){
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

  update(gem) {
    this.matched_gems[gem.type] += 1;
    this._gem_count += 1;
  }
  
  count() {
    return this._gem_count;
  }
}

export default MatchedGemCounter;
