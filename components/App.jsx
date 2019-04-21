import * as React from 'react';
import './App.css';
import Events from './events/Events';
import NotFound from './notFound/NotFound';
import Grid from '@material-ui/core/Grid';
import firebase, { db } from '../firebaseSetup.js';
import { Link } from 'react-router-dom';

class App extends React.Component {
  collections = {
    events: <Events />,
  };

  constructor (props) {
    super(props);
    this.state = {
      showLogin: false,
      permissions: [],
    };

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({user: user});
    });
  }

  getPermissions() {
    if (this.state.user) {
      let user = this.state.user;
      let permissionRef = db.collection('permissionGroups');
      let query = permissionRef.where(user.uid, "==", true);
      query.get().then(function(querySnapshot) {
        let permissions = [];
        querySnapshot.forEach((doc) => {
          // @ts-ignore
          permissions.push(doc.id);
        });
        //@ts-ignore
        this.setState({permissions: permissions});
      }.bind(this));
    }
  }

  showContent() {
    if (this.props.match.params.collection in this.collections) {
      return React.cloneElement(
        this.collections[this.props.match.params.collection],
        {}
      );
    } else {
      return (<NotFound />);
    }
  }

  render() {
    this.getPermissions();
    // @ts-ignore
    let movement = db.collection('movements').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // @ts-ignore
        let data = doc.data();
      });
    });

    //@ts-ignore
    let test = db;

    if (!this.state.permissions) {
      return (
        <div className="App">
          <h2>Permission Denied</h2>
          <p>If you think you should have access please contact an admin.</p>
        </div>
      )
    }

    return (
      <div className="Container">
        <Grid container spacing={24}>
          <Grid className="menu">
            <Link to='/events'>Events</Link>
          </Grid>
          <Grid className="App">
            {this.showContent()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
