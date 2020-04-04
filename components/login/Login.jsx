import * as React from 'react';
// import './Login.css';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import firebase, { uiConfig, StyledFirebaseAuth } from '../../src/firebase/firebaseSetup';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Log In
        </Button>
        <Dialog onClose={this.handleClose} aria-labelledby="Login" open={open}>
          <DialogTitle id="Login">Login</DialogTitle>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </Dialog>
      </div>
    );
  }
}

export default Login;
