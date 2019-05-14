import React from "react";
import { Form, Input } from "semantic-ui-react";

class HomeForm extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="homePageForm">
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label="First name"
                placeholder={
                  this.props.placeholders
                    ? this.props.placeholders.firstName
                    : "Loading. . ."
                }
                value={this.props.firstName}
                onChange={e =>
                  this.props.onValueChange({ firstName: e.target.value.trim() })
                }
              />
              <Form.Field
                control={Input}
                label="Last name"
                placeholder={
                  this.props.placeholders
                    ? this.props.placeholders.lastName
                    : "Loading. . ."
                }
                value={this.props.lastName}
                onChange={e =>
                  this.props.onValueChange({ lastName: e.target.value.trim() })
                }
              />
              <Form.Field
                control={Input}
                label="Phone Number"
                placeholder={
                  this.props.placeholders
                    ? this.props.placeholders.phoneNum
                    : "Loading. . ."
                }
                value={this.props.phoneNum}
                onChange={e =>
                  this.props.onValueChange({ phoneNum: e.target.value.trim() })
                }
              />
            </Form.Group>
          </Form>
        </div>
        <div className="subHead">Add your goals below</div>
      </React.Fragment>
    );
  }
}

export default HomeForm;
