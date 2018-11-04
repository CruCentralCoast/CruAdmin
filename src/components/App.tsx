import * as React from 'react';
import './App.css';
import Events from './Events/Events';
import NotFound from './notFound/NotFound';
import firebase, { db } from '../firebaseSetup.js';

class App extends React.Component <any, any> {
  private collections: object = {
    events: <Events />,
  };

  constructor (props: any) {
    super(props);
    this.state = {
      active: props.match.params.collection,
      showLogin: false,
      permissions: [],
    };

    firebase.auth().onAuthStateChanged((user: any) => {
      this.setState({user: user});
    });
  }

  private getPermissions() {
    if (this.state.user) {
      let user = this.state.user;
      let permissionRef = db.collection('permissionGroups');
      let query = permissionRef.where(user.uid, "==", true);
      query.get().then(function(querySnapshot: any) {
        let permissions: string[] = [];
        querySnapshot.forEach((doc: any) => {
          // @ts-ignore
          permissions.push(doc.id);
        });
        //@ts-ignore
        this.setState({permissions: permissions});
      }.bind(this));
    }
  }

  private showContent() {
    if (this.state.active in this.collections) {
      return React.cloneElement(
        this.collections[this.state.active],
        {}
      );
    } else {
      return (<NotFound />);
    }
  }

  public render() {
    this.getPermissions();
    // @ts-ignore
    let movement = db.collection('movements').get().then((querySnapshot) => {
      querySnapshot.forEach((doc: any) => {
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
        <div className="menu"></div>
        <div className="App">
          {this.showContent()}
        </div>
      </div>
    );
  }
}

export default App;
