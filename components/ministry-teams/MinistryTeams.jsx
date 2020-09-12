import * as React from 'react';
import { Button, CircularProgress, Grid, withStyles} 
from '@material-ui/core';

import { db, storage } from '../../src/firebase/firebaseSetup.js';
import { getAllFromFirestore } from '../Helpers';
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
      this.addMT = this.addMT.bind(this);
    }
  
    componentDidMount() {
      this.getMinistryTeams();
    }
    
    getMinistryTeams = () => {
      // get all ministry teams
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

    /* Callback to add/update MT */
    addMT = (mt) => {
      console.log("mt is ", mt);
      // ref to image
      const imageRef = storage.ref().child(mt.pic.name);

      // if image already exists, reuse url
      imageRef.getDownloadURL().then((foundURL) => {
        this.uploadAndAddMT(mt, foundURL);
      }, () => {
        // since image doesn't exist, upload image
        console.warn("File ", mt.pic.name, " doesn't exist");
        const uploadTask = imageRef.put(mt.pic);
        // check on status of upload task
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storage
              .ref()
              .child(mt.pic.name)
              .getDownloadURL()
              .then(url => {
                this.uploadAndAddMT(mt, url);
              });
          }
        )
      });
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
                {/* <PostLink key={event.id} event={event} /> */}
                <MinistryTeam mt={mt} users={this.state.users}/>
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