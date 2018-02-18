import React from "react";

class ScoreDisplay extends React.Component {
  render() {
    const { matches, score, turn } = this.props;

    return (
      <div>
        <div>
          <span className="gem-count-container">
            <span className="color-box" id="gem-type-0-color-box" />
            <span className="gem-count">{matches[0]}</span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-1-color-box" />
            <span className="gem-count">{matches[1]}</span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-2-color-box" />
            <span className="gem-count">{matches[2]}</span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-3-color-box" />
            <span className="gem-count">{matches[3]}</span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-4-color-box" />
            <span className="gem-count">{matches[4]}</span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-5-color-box" />
            <span className="gem-count">{matches[5]}</span>
          </span>
        </div>

        <div className="stats-display">
          <span className="stat-display">
            Turn:
            <span id="turn">{turn}</span>
          </span>

          <span className="stat-display">
            Score:
            <span id="score">{score}</span>
          </span>
        </div>
      </div>
    );
  }
}

export default ScoreDisplay;
