import * as React from 'react';
import './Login.css';
import firebase, { uiConfig, StyledFirebaseAuth } from '../../firebaseSetup.js';
import { Modal, Button } from 'react-bootstrap';

class Login extends React.Component <any, any> {
  constructor (props: any) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  private handleClose() {
    this.props.onModalChange();
  }

  public render() {
    return (
      <Modal show={this.props.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
      </Modal>
    );
  }
}

export default Login;
