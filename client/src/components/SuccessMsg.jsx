import React from "react";
import { Message } from "semantic-ui-react";

class SuccessMsg extends React.Component {
  getClassNames(show) {
    return show ? "showBanner" : "hideSuccess";
  }
  render() {
    return (
      <Message className={this.getClassNames(this.props.show)} positive>
        <Message.Header>{this.props.title}</Message.Header>
        <p>{this.props.msg}</p>
      </Message>
    );
  }
}

export default SuccessMsg;
