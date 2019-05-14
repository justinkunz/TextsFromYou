import React from "react";
import { Input } from "semantic-ui-react";

class GoalCard extends React.Component {
  render() {
    return (
      <div className="goalCard">
        <i
          className={this.props.showX ? "fas fa-times fa-2x removeGoal" : ""}
          onClick={
            this.props.showX
              ? () => this.props.removeGoal(this.props.index)
              : null
          }
        />
        <span>I want to </span>
        <Input
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={e =>
            this.props.onGoalChange(this.props.index, e.target.value)
          }
          className="goalInput"
        />
        <i
          className="fas fa-plus fa-2x addNew"
          onClick={this.props.addNewGoal}
        />
      </div>
    );
  }
}

export default GoalCard;
