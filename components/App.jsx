import * as React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

import Events from './events/Events';
import NotFound from './notFound/NotFound';
import firebase, { db } from '../src/firbase/firebaseSetup';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: [],
    };

    this.collections = {
      events: <Events />,
    };

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
    });
  }

  getPermissions() {
    if (this.state.user) {
      const { user } = this.state;
      const permissionRef = db.collection('permissionGroups');
      const query = permissionRef.where(user.uid, '==', true);
      query.get().then((querySnapshot) => {
        const permissions = [];
        querySnapshot.forEach((doc) => {
          // @ts-ignore
          permissions.push(doc.id);
        });
        // @ts-ignore
        this.setState({ permissions });
      });
    }
  }

  showContent() {
    if (this.props.match.params.collection in this.collections) {
      return React.cloneElement(
        this.collections[this.props.match.params.collection],
        {},
      );
    }
    return (<NotFound />);
  }

  render() {
    this.getPermissions();
    const movement = db.collection('movements').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
      });
    });

    if (!this.state.permissions) {
      return (
        <div className="App">
          <h2>Permission Denied</h2>
          <p>If you think you should have access please contact an admin.</p>
        </div>
      );
    }

    return (
      <div className="Container">
        <Grid container spacing={3}>
          <Grid className="menu">
            <Link to="/events">Events</Link>
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
