import * as React from 'react';
import PropTypes from 'prop-types';
// import logo from '../../static/cru_logo.png';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Button, Drawer, Divider, List, 
  ListItem, ListItemIcon, ListItemText, Typography,
  Toolbar } from '@material-ui/core';

import { Event, Group, Rowing, School } from '@material-ui/icons';

// import './Heading.css';
import firebase from '../../src/firebase/firebaseSetup';
import Login from '../login/Login';

const drawerWidth = 229;

const styles = (style) => ({
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
  },
});

class Heading extends React.Component {
  constructor(props) {
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
        this.setState({ showLogin: false });
        this.setState({ loggedIn: true });
      } else {
        this.setLogin(user);
        this.setState({ showLogin: true });
        this.setState({ loggedIn: false });
      }
    });
  }

  setLogin(user) {
    let login;
    if (user) {
      login = (
        <div>
          <span className="Login-state">
            Welcome,
            {' '}
            {user.displayName || 'User'}
            <Button onClick={() => firebase.auth().signOut()}>Sign-out</Button>
          </span>
        </div>
      );
    } else {
      // @ts-ignore
      login = (<Login />);
    }
    this.setState({ login });
  }

  showLogin() {
    this.setState({ showLogin: true });
  }

  handleLoginChange() {
    const { showLogin } = this.state;
    this.setState({ showLogin: !showLogin });
  }

  render() {
    const { classes, children } = this.props;
    const { login, loggedIn } = this.state;
    const menu = (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.menuToolbar} />
        <Divider />
        <List>
          <ListItem button component="a" key="Events" href="/events">
            <ListItemIcon><Event /></ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
          <ListItem button component="a" key="Campuses" href="/campuses">
            <ListItemIcon><School /></ListItemIcon>
            <ListItemText primary="Campuses" />
          </ListItem>
          <ListItem button component="a" key="Community Groups" href="/community-groups">
            <ListItemIcon><Group /></ListItemIcon>
            <ListItemText primary="Community Groups" />
          </ListItem>
          <ListItem button component="a" key="Ministry Teams" href="/ministry-teams">
            <ListItemIcon><Rowing /></ListItemIcon>
            <ListItemText primary="Ministry Teams" />
          </ListItem>
        </List>
      </Drawer>
    );

    const loginPrompt = (
      <div className={classes.prompt}>
        <Typography
          component="h2"
          variant="h2"
          color="inherit"
          className={classes.promptTitle}
          align="center"
          noWrap
        >
          Please Log In To Continue
        </Typography>
        <br />
        <Login />
      </div>
    );

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
            {login}
          </Toolbar>
        </AppBar>
        {loggedIn ? menu : ''}
        <main className={loggedIn ? classes.content : classes.loginPrompt}>
          <div className={classes.menuToolbar} />

          {loggedIn ? children : loginPrompt}
        </main>
      </div>
    );
  }
}

// Heading.propTypes = {
//   classes: PropTypes.shape({
//     // TODO: finish adding fields
//   }).isRequired,
//   children: PropTypes.instanceOf(React.ReactNode).isRequired,
// };

export default withStyles(styles)(Heading);
