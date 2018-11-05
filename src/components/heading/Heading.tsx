import * as React from 'react';
import './Heading.css';
import firebase from '../../firebaseSetup.js';
import Login from '../login/Login';
import logo from '../../cru_logo.png';
import { Button, Container } from 'react-bootstrap';

class Heading extends React.Component <any, any> {
  constructor (props: any) {
    super(props);
    this.state = {
      showLogin: false,
    };

    this.showLogin = this.showLogin.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);

    firebase.auth().onAuthStateChanged((user: any) => {
      this.setLogin(user);
      this.setState({showLogin: false});
    });
  }

  private handleLoginChange() {
    this.setState({showLogin: !this.state.showLogin});
  }

  private showLogin() {
    this.setState({showLogin: true});
  }

  private setLogin(user: any) {
    let login;
    if (user) {
      login = (
        <div>
          <span className="Login-state">Welcome {user.displayName}<Button variant="link" onClick={() => firebase.auth().signOut()}>Sign-out</Button></span>
        </div>
      );
    } else {
      // @ts-ignore
      login = (<Button className="Login-state" variant="primary" onClick={this.showLogin}>Login</Button>);
    }
    this.setState({login: login});
  }

  public render() {
    let login;
    if (this.state.showLogin) {
      login = <Login show={this.state.showLogin} onModalChange={this.handleLoginChange}></Login>;
    }

    return (
      <div className="Header">
        <Container>
          <header className="Header-body row align-items-center">
            <div className="col-sm">
              <a href="/"><img src={logo} className="Header-logo" alt="logo" /></a>
            </div>
            <div className="col-sm Header-title">
              <span>Cru Admin Portal</span>
            </div>
            <div className="col-sm">{this.state.login}</div>
          </header>
        </Container>
        {login}
      </div>
    );
  }
}

export default Heading;
