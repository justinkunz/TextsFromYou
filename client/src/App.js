import React, { Component } from "react";
import SweetAlert from "sweetalert2-react";
import { getDisplay, getErrors, getUnsub, getContact } from "./api";
import {
  HomeForm,
  PageTitle,
  SuccessMsg,
  AlertMsg,
  FooterLinks,
  PrivacyPolicy
} from "./components";
import { GoalEntryContainer } from "./containers";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goals: [""],
      checkedSMS: false,
      checkedTOS: false,
      banner: ""
    };
  }

  componentDidMount() {
    this.getDisplayInfo();
  }

  componentDidUpdate() {
    if (!this.state.goals || this.state.goals.length === 0)
      this.setState({ goals: [""] });
  }

  getDisplayInfo = async () => {
    const details = await Promise.all([getDisplay(), getErrors()]);
    const [display, alert] = details.map(detail => detail.data);
    this.setState({ display, alert });
  };

  onGoalChange = (index, val) => {
    let tempGoals = this.state.goals;
    tempGoals[index] = val;
    this.setState({ goals: tempGoals });
  };

  removeGoal = index => {
    let tempGoals = this.state.goals;
    tempGoals.splice(index, 1);
    this.setState({ goals: tempGoals });
  };

  addNewGoal = () => {
    let tempGoals = this.state.goals;
    tempGoals.push("");
    this.setState({ goals: tempGoals });
  };

  setModal = async api => {
    const response = await api();
    this.setState({
      modalTitle: response.data.title,
      modalText: response.data.msg,
      showModal: true
    });
  };

  showModal = (title, msg) => {
    this.setState({
      modalTitle: title,
      modalText: msg,
      showModal: true
    });
  };

  setBanner = (title, msg) => {
    const banner = {
      ...this.state.banner,
      title,
      msg
    };
    this.setState(banner);
  };

  toggle = key => {
    this.setState({ [key]: !this.state[key] });
  };

  resetPage = banner => {
    this.setState({
      banner,
      goals: [""],
      firstName: "",
      lastName: "",
      phoneNum: "",
      checkedSMS: false,
      checkedTOS: false
    });
  };

  render() {
    const {
      display,
      banner,
      alert,
      checkedSMS,
      checkedTOS,
      firstName,
      lastName,
      phoneNum,
      goals,
      privacyPolicy,
      showModal,
      modalTitle,
      modalText
    } = this.state;

    const userData = {
      firstName,
      lastName,
      phoneNum,
      goals,
      checkedTOS,
      checkedSMS
    };
    const agreements = {
      sms: {
        checked: checkedSMS,
        agreement: display ? display.legal.smsAgreement : "Loading. . .",
        clickHandle: () => this.toggle("checkedSMS")
      },
      tos: {
        checked: checkedTOS,
        agreement: display ? display.legal.tosAgreement : "Loading. . .",
        clickHandle: () => this.toggle("checkedTOS")
      }
    };

    return (
      <div className="App">
        <div className={privacyPolicy ? "hideApp" : "showApp"}>
          <div className="App-head">
            <AlertMsg alert={alert} />
            <SuccessMsg
              show={banner.showBanner}
              title={banner.title}
              msg={banner.msg}
            />
            <PageTitle />
            <HomeForm
              userData={userData}
              onValueChange={val => this.setState(val)}
              placeholders={display ? display.placeholders.infoCard : ""}
            />
          </div>

          <GoalEntryContainer
            display={display}
            goals={goals}
            onGoalChange={(index, val) => this.onGoalChange(index, val)}
            addNewGoal={() => this.addNewGoal()}
            removeGoal={index => this.removeGoal(index)}
            agreements={agreements}
            userData={userData}
            resetPage={banner => this.resetPage(banner)}
            enableApp={alert ? alert.enableApp : false}
            showModal={(title, msg) => this.showModal(title, msg)}
            showBanner={(title, msg) => this.setBanner(title, msg)}
          />

          <FooterLinks
            showPrivacy={privacyPolicy}
            resetPrivacy={() => this.resetPrivacy()}
            toggleUnsub={() => this.setModal(getUnsub)}
            toggleContact={() => this.setModal(getContact)}
            termsLink={display ? display.legal.termsLink : "about:blank"}
            handlePrivacyToggle={() => this.toggle("privacyPolicy")}
          />
        </div>
        <PrivacyPolicy
          show={privacyPolicy}
          resetPrivacy={() => this.toggle("privacyPolicy")}
        />
        <SweetAlert
          show={showModal}
          title={modalTitle}
          text={modalText}
          onConfirm={() => this.setState({ showModal: false })}
        />
      </div>
    );
  }
}

export default App;
