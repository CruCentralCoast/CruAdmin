import * as React from 'react';
import './App.css';
import {db} from '../firebaseSetup.js';

class App extends React.Component <any, any> {
  constructor (props: any) {
    super(props);
    this.state = {
      showLogin: false,
    };
  }

  public render() {
    // @ts-ignore
    let movement = db.collection('movements').get().then((querySnapshot) => {
      querySnapshot.forEach((doc: any) => {
        // @ts-ignore
        let data = doc.data();
      });
    });

    return (
      <div className="App">
        testing
      </div>
    );
  }
}

export default App;
