import React from "react";
import { Agreement, SubmitBtn } from "../components";
import GoalCards from "./GoalCardsContainer";

class GoalEntry extends React.Component {
  render() {
    const {
      display,
      goals,
      enableApp,
      userData,
      onGoalChange,
      addNewGoal,
      removeGoal,
      resetPage,
      checkedSMS,
      checkedTOS,
      smsAgreement,
      tosAgreement,
      checkHandlerSMS,
      checkHandlerTOS,
      showModal
    } = this.props;

    return (
      <React.Fragment>
        <div className="center-card">
          <GoalCards
            goals={goals}
            onGoalChange={(index, val) => onGoalChange(index, val)}
            addNewGoal={() => addNewGoal()}
            removeGoal={index => removeGoal(index)}
            placeholders={display ? display.placeholders.goals : ""}
          />
        </div>
        <Agreement
          checked={checkedSMS}
          checkHandler={checkHandlerSMS}
          label={smsAgreement}
        />
        <Agreement
          checked={checkedTOS}
          checkHandler={checkHandlerTOS}
          label={tosAgreement}
        />
        <SubmitBtn
          enabled={enableApp}
          userData={userData}
          validationMsg={display ? display.errorMsgs : ""}
          resetPage={banner => resetPage(banner)}
          showModal={(title, msg) => showModal(title, msg)}
        />
      </React.Fragment>
    );
  }
}

export default GoalEntry;
