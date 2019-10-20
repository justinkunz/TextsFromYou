import React from "react";
import { Agreement, SubmitBtn } from "../components";
import GoalCards from "./GoalCardsContainer";

class GoalEntry extends React.Component {
  render() {
    const {
      display,
      goals,
      onGoalChange,
      addNewGoal,
      removeGoal,
      agreements,
      userData,
      resetPage,
      enableApp,
      showModal
    } = this.props;
    // const {
    //   display,
    //   goals,
    //   enableApp,
    //   userData,
    //   onGoalChange,
    //   addNewGoal,
    //   removeGoal,
    //   resetPage,
    //   checkedSMS,
    //   checkedTOS,
    //   smsAgreement,
    //   tosAgreement,
    //   checkHandlerSMS,
    //   checkHandlerTOS,
    //   showModal
    // } = this.props;

    const { sms, tos } = agreements;

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
          checked={sms.checked}
          checkHandler={sms.clickHandle}
          label={sms.agreement}
          styleClass="sms"
        />
        <Agreement
          checked={tos.checked}
          checkHandler={tos.clickHandle}
          label={tos.agreement}
          styleClass="tos"
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
