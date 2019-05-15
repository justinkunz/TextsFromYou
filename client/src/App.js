import React, { Component } from 'react';
import SweetAlert from 'sweetalert2-react';
import { getDisplay, getErrors, getUnsub, getContact } from './api';
import { 
  HomeForm, 
  PageTitle, 
  SuccessMsg, 
  AlertMsg, 
  FooterLinks, 
  PrivacyPolicy 
} from './components';
import { GoalEntryContainer } from './containers';

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      goals: [""], 
      checkedSMS: false, 
      checkedTOS: false,
      banner: ""
      }
    }

  componentDidMount() {
    this.getDisplayInfo();
  };

  componentDidUpdate() {
    if(!this.state.goals || this.state.goals.length === 0) this.setState({goals: [""]});
  };

  getDisplayInfo = async() => {
    const display = await getDisplay();
    this.setState({ display: display.data });
    const errors = await getErrors();
    this.setState({alert: errors.data});
  }

  onGoalChange = (index, val) => {
    let tempGoals = this.state.goals;
    tempGoals[index] = val;
    this.setState({goals: tempGoals});
  }

  removeGoal = index => {
    let tempGoals = this.state.goals;
    tempGoals.splice(index, 1);
    this.setState({goals: tempGoals});
  }
  
  addNewGoal = () => {
    let tempGoals = this.state.goals;
    tempGoals.push("");
    this.setState({goals: tempGoals});
  };

  setModal = async apiCall => {
    const response = await apiCall();
    this.setState({ modalTitle: response.data.title, modalText: response.data.msg, showModal: true });
  }

  setBanner = (title, msg) => {
    const banner = {
      ...this.state.banner,
      title,
      msg
    };
    this.setState(banner);
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
            firstName={firstName} 
            lastName={lastName} 
            phoneNum={phoneNum} 
            onValueChange={val => this.setState(val)}
            placeholders={display ? display.placeholders.infoCard: ""}
          />
        </div>
        <GoalEntryContainer 
          display={display}
          goals={goals}
          onGoalChange={(index, val) => this.onGoalChange(index, val)}
          addNewGoal={() => this.addNewGoal()}
          removeGoal={index => this.removeGoal(index)}
          checkedSMS={checkedSMS}
          checkedTOS={checkedTOS}
          smsAgreement={display ? display.legal.smsAgreement : "Loading. . ."}
          tosAgreement={display ? display.legal.tosAgreement : "Loading. . ."}
          checkHandlerSMS={() => this.setState({checkedSMS: !this.state.checkedSMS})}
          checkHandlerTOS={() => this.setState({checkedTOS: !this.state.checkedTOS})}
          userData={{ firstName, lastName, phoneNum, goals, checkedTOS, checkedSMS}}
          resetPage={banner => this.resetPage(banner)}
          enableApp={alert ? alert.enableApp : false}
          showModal={(title, msg) => this.setState({modalTitle: title, modalText: msg, showModal: true})}
          showBanner={(title, msg) => this.setBanner(title, msg)}
        />
        <FooterLinks
          showPrivacy={privacyPolicy} 
          resetPrivacy={() => this.resetPrivacy()}
          toggleUnsub={() => this.setModal(getUnsub)}
          toggleContact={()=> this.setModal(getContact)}
          termsLink={display ? display.legal.termsLink : "about:blank"}
          handlePrivacyToggle={() => this.setState({ privacyPolicy: !this.state.privacyPolicy })}
        />
      </div>
      <PrivacyPolicy
        show={privacyPolicy}
        resetPrivacy={() => this.setState({ privacyPolicy: !this.state.privacyPolicy })}
      />
      <SweetAlert
        show={showModal}
        title={modalTitle}
        text={modalText}
        onConfirm={() => this.setState({showModal: false})}
      />
      </div>
    );
  };
};

export default App;
