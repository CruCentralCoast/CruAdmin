import * as React from 'react';
import { Button, CircularProgress, Grid, withStyles} 
from '@material-ui/core';
import { db } from '../../src/firebase/firebaseSetup.js';
import { getAllFromFirestore, uploadImage } from '../Helpers';
import MinistryTeam from './MinistryTeamsCard';
import EditForm from './MinistryTeamsEditForm';

const styles = style => ({
    progress: {
      margin: style.spacing(2),
    },
    formControl: {
      margin: style.spacing(1),
      minWidth: 120,
    },
    newMTbutton: {
      float: 'right'
    }
  });

// This component is the base of Ministry Team tab
class MinistryTeams extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      mts: [], // stands for ministry teams
      loading: true,
      openForm: false,
    };

    this.getMinistryTeams = this.getMinistryTeams.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.removeMT = this.removeMT.bind(this);
  }

  componentDidMount() {
    this.getMinistryTeams();
  }
  
  // get all ministry teams
  getMinistryTeams = () => {
    var mts = getAllFromFirestore('ministryteams');
    // get all users
    var users = getAllFromFirestore('users');
    // combine both collections to pass to Cards
    Promise.all([mts, users]).then((data) => {
      this.setState({
        mts: data[0],
        users: data[1],
        loading: false
      });
    });
  }

  // uploads mt and re-renders mt view
  uploadAndAddMT = (mt, url) => {
    var newMts = this.state.mts;
    db.collection("ministryteams").add({
      description: mt.description,
      imageLink: url,
      leadersNames: mt.leadersNames,
      name: mt.name
    }).then((mtCallback) => {
      // id needed for Firestore to update, imageLink retrieves image
      mt.id = mtCallback.id;
      mt.imageLink = url;
      newMts.push(mt);
      this.setState({
        mts: newMts
      });
    });
  }

  /* Callback to remove the MT from those MT's 
    displayed based on index */ 
  removeMT = (id) => {
    db.collection("ministryteams").doc(id).delete().
    then(() => {
        let mts = this.state.mts;
        // look for mt to remove
        for (let i = 0; i < mts.length; i++) {
          if (mts[i].id === id) {
            mts.splice(i, 1);
            break;
          }
        }
        // set state to remove it
        this.setState({
          mts
        });
    });
  }

  /* Callback to add MT 
   if photo already in FireStorage, use it else upload new photo.
  */
  addMT = (mt) => {
    uploadImage(mt, this.uploadAndAddMT);
  }

  handleForm = (open) => {
    this.setState({
      openForm: open
    });
  }

  render() {
    const { classes } = this.props;
    let addMTForm; // only render form when done loading!
    let data = [];

    let loading = (<CircularProgress className={classes.progress} />);
    // only display data if NOT loading
    if (!this.state.loading) {
        data = this.state.mts.map((mt) => (
            (<Grid key={mt.id} item xs={12} md={4} lg={3}>
              <MinistryTeam mt={mt} users={this.state.users}
              removeCallback={this.removeMT}/>
          </Grid>)));
        // needed to display new MT form
        let emptyMT = {
          description: '',
          imageLink: '',
          leadersNames: [''],
          name: ''
        };
        addMTForm = (<EditForm open={this.state.openForm} users={this.state.users}
          updateMT={this.addMT} mt={emptyMT}
          handleEdit={this.handleForm} update="false">
        </EditForm>);
    }
    
    return (
        <div>
            <Button className={classes.newMTbutton} variant="contained" 
            color="primary" onClick={() => this.handleForm(true)}>
              New Ministry Team
            </Button>
            {!this.state.loading && addMTForm}
            <Grid container spacing={2} component={'div'} direction={'row'} justify={'center'}>
            {this.state.loading ? loading : data}
            </Grid>
        </div>
    );
  }
}

export default withStyles(styles)(MinistryTeams);