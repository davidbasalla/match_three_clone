import React from 'react'

class ScoreDisplay extends React.Component {
  render() {
    console.log(this.props)
    console.log(this.props.matches)
    console.log(this.props.matches[0])
    return (
      <div>
        <div>
          <span className="gem-count-container">
            <span className="color-box" id="gem-type-0-color-box"></span>
            <span className="gem-count">
              { this.props.matches[0] }
            </span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-1-color-box"></span>
            <span className="gem-count">
              { this.props.matches[1] }
            </span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-2-color-box"></span>
            <span className="gem-count">
              { this.props.matches[2] }
            </span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-3-color-box"></span>
            <span className="gem-count">
              { this.props.matches[3] }
            </span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-4-color-box"></span>
            <span className="gem-count">
              { this.props.matches[4] }
            </span>
          </span>

          <span className="gem-count-container">
            <span className="color-box" id="gem-type-5-color-box"></span>
            <span className="gem-count">
              { this.props.matches[5] }
            </span>
          </span>
        </div>

        <div className="stats-display"> 
          <span className="stat-display"> 
            Turn: 
            <span id="turn">{this.props.turn}</span>
          </span>

          <span className="stat-display"> 
            Score: 
            <span id="score">{this.props.score}</span>
          </span>
        </div>
      </div>
    )
  }
}

export default ScoreDisplay
