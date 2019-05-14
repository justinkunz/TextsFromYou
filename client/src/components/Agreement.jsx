import React from "react";
import { Checkbox } from "semantic-ui-react";

class Agreement extends React.Component {
  render() {
    return (
      <div className="center-card">
        <Checkbox
          label={this.props.label}
          className="sms"
          onClick={() => this.props.checkHandler()}
          checked={this.props.checked}
        />
      </div>
    );
  }
}

export default Agreement;
