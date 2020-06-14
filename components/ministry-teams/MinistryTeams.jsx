import * as React from 'react';
import { Button, CircularProgress, Grid, withStyles} 
from '@material-ui/core';

import { db } from '../../src/firebase/firebaseSetup.js';
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

    /* Callback to add CG to end of list */
    addMT = (mt) => {
      db.collection("ministryteams").add({
        description: mt.description,
        imageLink: mt.imageLink, // TODO: upload image to fireStore then place here
        leadersNames: mt.leadersNames,
        name: mt.name
      }).then((mtCallback) => {
        // id needed for Firestore
        mt.id = mtCallback.id;
        let newMts = this.state.mts;
        newMts.push(mt);
        this.setState({
          mts: newMts
        });
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
                <MinistryTeam mt={mt} mts={this.state.mts}/>
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
            handleEdit={this.handleForm}>
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