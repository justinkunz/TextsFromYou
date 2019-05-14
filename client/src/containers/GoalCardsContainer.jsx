import React from "react";
import { GoalCard } from "../components";

class GoalCards extends React.Component {
  render() {
    const placeholders = this.props.placeholders || ["Loading. . ."];
    const getPlaceholder = () => {
      return placeholders[Math.floor(Math.random() * placeholders.length)];
    };
    let showX;
    if (this.props.goals.length === 1) {
      showX = false;
    } else {
      showX = true;
    }
    return this.props.goals.map((goal, i) => (
      <GoalCard
        index={i}
        onGoalChange={(index, val) => this.props.onGoalChange(index, val)}
        addNewGoal={() => this.props.addNewGoal()}
        removeGoal={index => this.props.removeGoal(index)}
        showX={showX}
        value={goal}
        placeholder={getPlaceholder()}
        key={i}
      />
    ));
  }
}

export default GoalCards;
