import React from "react";
import { Button } from "semantic-ui-react";
import axios from "axios";
import SweetAlert from "sweetalert2-react";

class SubmitBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, title: null, subtxt: null };
  }

  //validates entry data
  validate = data => {
    if (!data.firstName || !data.lastName || !data.phoneNum) {
      return {
        validated: false,
        type: "missing"
      };
    }
    if (!data.checkedSMS || !data.checkedTOS) {
      return {
        validated: false,
        type: "agreement"
      };
    }

    data.goals = this.convertGoals(data.goals);
    if (data.goals.length === 0) {
      return {
        validated: false,
        type: "goals"
      };
    }
    data.phoneNum = this.numOnly(data.phoneNum);
    if (data.phoneNum.length !== 10) {
      return {
        validated: false,
        type: "phoneNum"
      };
    }
    return {
      validated: true,
      data
    };
  };

  //removes blanks from array
  convertGoals = goals => {
    let newGoals = [];
    for (let i = 0; i < goals.length; i++) {
      if (goals[i] !== "") newGoals.push(goals[i]);
    }
    return newGoals;
  };

  //returns only numeric value from string
  numOnly = num => {
    let newNum = "";
    for (let i = 0; i < num.length; i++) {
      if (!isNaN(num[i]) & (num[i] !== " ")) {
        newNum = newNum + num[i].toString();
      }
    }
    return newNum;
  };

  showAlert = results => {
    const type = this.decisionAlert(results);
    const { title, subtxt } = type;
    this.props.showModal(title, subtxt);
  };
  decisionAlert = results => {
    const {
      missingFields,
      invalidPhone,
      missingGoals,
      missingAgreement,
      generic
    } = this.props.validationMsg;
    switch (results) {
      case "missing":
        return missingFields;
      case "phoneNum":
        return invalidPhone;
      case "goals":
        return missingGoals;
      case "agreement":
        return missingAgreement;
      default:
        return generic;
    }
  };

  //called to post results to db
  postResults = async () => {
    const { userData, enabled } = this.props;
    if (!enabled) return;
    const results = this.validate(userData);
    if (!results.validated) {
      this.showAlert(results.type);
      return;
    }
    console.log(results);
    const response = await axios.post("/api/new-account", results.data);
    const { data } = response;
    this.setState({
      banner: data.banner,
      title: data.title,
      subtxt: data.msg,
      status: data.status,
      show: true
    });
  };

  handleAlert = () => {
    if (this.state.status === "success") {
      this.props.resetPage(this.state.banner);
    }
    this.setState({ show: false });
  };

  render() {
    return (
      <div className="center-card">
        <br />
        <SweetAlert
          show={this.state.show}
          title={this.state.title}
          text={this.state.subtxt}
          onConfirm={() => this.handleAlert()}
        />
        <Button color="violet" onClick={() => this.postResults()}>
          Reach Your Goals!
        </Button>
      </div>
    );
  }
}

export default SubmitBtn;
