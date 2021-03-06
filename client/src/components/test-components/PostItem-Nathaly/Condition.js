import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import RadioButtonsGroup from "./RadioButtons";

export class Condition extends Component {
  continue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <MuiThemeProvider>
        <>
          <Dialog open fullWidth maxWidth="sm">
            <AppBar title="Select Item Condition" />
            <br />
            <h6>Is your item new or used?</h6>
<<<<<<< HEAD:client/src/components/PostItem/Condition.js
            {/* <Button>New</Button>
            <br />
            <Button>Used</Button> */}
            <RadioButtonsGroup />
=======
            <Button
              label="Is your item new or used?"
              onChange={handleChange("condition")}
              defaultValue={values.condition}
            >
              New
            </Button>
            <br />
            <Button
              label="Is your item new or used?"
              onChange={handleChange("condition")}
              defaultValue={values.condition}
            >
              Used
            </Button>

            {/* <TextField
              placeholder="Condition"
              label="Is your item new or used?"
              onChange={handleChange("condition")}
              defaultValue={values.condition}
              margin="normal"
              fullWidth
            /> */}
>>>>>>> a02ba993eb4e7c44e500714aa5be2bd6bb69b60c:client/src/components/test-components/PostItem-Nathaly/Condition.js
            <br />
            <Button color="secondary" variant="contained" onClick={this.back}>
              Back
            </Button>

            <Button color="primary" variant="contained" onClick={this.continue}>
              Continue
            </Button>
          </Dialog>
        </>
      </MuiThemeProvider>
    );
  }
}

export default Condition;
