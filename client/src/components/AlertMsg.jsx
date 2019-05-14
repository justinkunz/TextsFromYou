import React, { Component } from "react";
import { Message } from "semantic-ui-react";

class AlertMsg extends Component {
  getClassNames(type) {
    return "showBanner " + type;
  }
  render() {
    const alert = this.props.alert;
    if (!alert || !alert.isError) return <React.Fragment />;
    return (
      <Message className={this.getClassNames(alert.alertBanner.displayClass)}>
        <Message.Header>{alert.alertBanner.title}</Message.Header>
        <p>{alert.alertBanner.msg}</p>
      </Message>
    );
  }
}
export default AlertMsg;
