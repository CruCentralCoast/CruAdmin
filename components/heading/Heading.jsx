import * as React from 'react';
// import './Heading.css';
import firebase from '../../src/firebase/firebaseSetup.js';
import Login from '../login/Login';
// import logo from '../../static/cru_logo.png';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Button, Typography, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';

const drawerWidth = 155;

const styles = style => ({
  appBar: {
    zIndex: style.zIndex.drawer + 1,
  },
  header: {
    textAlign: 'center',
    width: '100%',
  },

  headerToolbar: {
    paddingLeft: '200px',
    paddingRight: '200px',
  },

  headerMenu: {
    paddingLeft: '200px',
    paddingRight: '200px',
  },

  // logo: {
  //   marginLeft: '20px',
  // },

  headerLogo: {
    float: 'left',
    height: '30px',
    cursor: 'pointer',
  },

  headerBody: {
    height: '60px',
  },

  title: {
    color: '#666062',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  loginState: {
    color: '#666062',
    float: 'right',
  },

  menuToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...style.mixins.toolbar,
  },

  prompt: {
    marginTop: '20%',
  },

  drawer: {
    flexShrink: 0,
  },

  promptTitle: {
    color: '#666062',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '70px',
    width: '100%',
  },

  content: {
    flexGrow: 1,
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    padding: style.spacing(3),
  },

  loginPrompt: {
    ...style.content,
    width: '100%',
  }
})
class Heading extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showLogin: false,
      loggedIn: false,
    };

    this.showLogin = this.showLogin.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setLogin(user);
        this.setState({showLogin: false});
        this.setState({loggedIn: true});
      } else {
        this.setLogin(user);
        this.setState({showLogin: true});
        this.setState({loggedIn: false});
      }
    });
  }

  handleLoginChange() {
    this.setState({showLogin: !this.state.showLogin});
  }

  showLogin() {
    this.setState({showLogin: true});
  }

  setLogin(user) {
    let login;
    if (user) {
      login = (
        <div>
          <span className="Login-state">Welcome, {user.displayName || 'User'}<Button onClick={() => firebase.auth().signOut()}>Sign-out</Button></span>
        </div>
      );
    } else {
      // @ts-ignore
      login = (<Login></Login>);
    }
    this.setState({login: login});
  }

  render() {
    const { classes } = this.props
    let menu = (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.menuToolbar}>
        </div>
        <Divider />
        <List>
            <ListItem button component="a" key='Events' href='/events'>
              <ListItemIcon><EventIcon /></ListItemIcon>
              <ListItemText primary='Events' />
            </ListItem>
        </List>
      </Drawer>
    );

    let loginPrompt = (
      <div className={classes.prompt}>
        <Typography
          component="h2"
          variant="h2"
          color="inherit"
          className={classes.promptTitle}
          align="center"
          noWrap
        >Please Log In To Continue</Typography>
        <br></br>
        <Login></Login>
      </div>
    )

    return (
      <div className={classes.header}>
        <AppBar
          color="default"
          position="fixed"
          className={classes.appBar}
        >
          <Toolbar className={classes.headerToolbar}>
            <div className={classes.logo}>
              <a href="/"><img src="/static/cru_logo.png" className={classes.headerLogo} alt="logo" /></a>
            </div>
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              className={classes.title}
              align="center"
              noWrap
            >
              Cru Admin Portal
            </Typography>
            {this.state.login}
          </Toolbar>
        </AppBar>
        {this.state.loggedIn ? menu : ''}
        <main className={this.state.loggedIn ? classes.content : classes.loginPrompt}>
          <div className={classes.menuToolbar}></div>

          {this.state.loggedIn ? this.props.children : loginPrompt}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Heading);
