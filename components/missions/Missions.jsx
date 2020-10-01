import * as React from 'react';
import { Button, CircularProgress, Grid, Tab, Tabs, withStyles } from '@material-ui/core';
import * as moment from 'moment';
import { db } from '../../src/firebase/firebaseSetup.js';
import { getAllFromFirestore, uploadImage } from '../Helpers';
import { firebase } from '../../src/firebase/firebaseSetup.js';
import Mission from './MissionCard';
import EditForm from './MissionEditForm';

const styles = style => ({
    progress: {
      margin: style.spacing(2),
    },
    tabs: {
      marginBottom: '20px',
    },
    indicator: {
      display: 'none',
    },
    futureTab: {
      borderRadius: "30px 0px 0px 30px",
      backgroundColor: '#f0efef',
    },
    selectedFuture: {
      backgroundColor: '#f9b625',
      color: '#f0efef',
    },
    pastTab: {
      borderRadius: "0px 30px 30px 0px",
      backgroundColor: '#f0efef',
    },
    selectedPast: {
      backgroundColor: '#f9b625',
      color: '#f0efef',
    },
    newMissionButton: {
      float: 'right'
    }
  });

const now = moment();

// This component is the base of Missions tab
class Missions extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        loading: true,
        futureMissions: [],
        openForm: false,
        pastMissions: [],
        showPast: 0,
      };

      this.getMissions = this.getMissions.bind(this);
      this.handleForm = this.handleForm.bind(this);
      this.removeMission = this.removeMission.bind(this);
    }

    componentDidMount() {
      this.getMissions();
    }

    getMissions = () => {
      // get all missions
      var missions = getAllFromFirestore('missions');
      // combine both collections to pass to Cards
      Promise.all([missions]).then((data) => {
        var missions = data[0];
        // unwrap the timestamp to be seconds
        for (var i = 0; i < missions.length; i++) {
          missions[i].endDate = missions[i].endDate.seconds;
          missions[i].startDate = missions[i].startDate.seconds;
        }
        // iterate through missions and check data
        var futureMissions = missions.filter(mission => now.unix() < mission.endDate);
        var pastMissions = missions.filter(mission => now.unix() > mission.endDate);
        console.log("now: ", now.unix());
        console.log("mission start date ", missions[0].startDate);
        console.log("mission end date ", missions[0].endDate);
        // console.log("one: ", missions[0].endDate.seconds);
        console.log("Future is: ", futureMissions);
        console.log("Past is: ", pastMissions);
        this.setState({
          futureMissions,
          pastMissions,
          loading: false
        });
      });
    }

    tabChange = (_, showPast) => {
      if (showPast == 1) {
        this.setState({
          showPast: 0,
        });
      } else {
        this.setState({
          showPast: 1,
        });
      }
    }

    /* Callback to remove the Mission from those Mission's 
    displayed based on index */ 
    removeMission = (id) => {
      db.collection("missions").doc(id).delete().
      then(() => {
          // check which tab we're on
          if (this.state.showPast == 1) {
            let pastMissions = this.state.pastMissions.filter(
              mission => mission.id !== id);
            // set state to remove it
            this.setState({
              pastMissions
            });
          } else { // remove from future
            let futureMissions = this.state.futureMissions.filter(
              mission => mission.id !== id);
            // set state to remove it
            this.setState({
              futureMissions
            });
          }
      });
    }

    /* uploads mission and re-renders mission view.
    Only allow adding NEW missions
    */
    uploadAndAddMission = (mission, url) => {
      var newMissions = this.state.futureMissions;
      db.collection("missions").add({
        description: mission.description,
        endDate: new firebase.firestore.Timestamp(mission.endDate, 0),
        imageLink: url,
        location: mission.location,
        name: mission.name,
        startDate: new firebase.firestore.Timestamp(mission.startDate, 0),
        url: mission.url,
      }).then((missionCallback) => {
        // id needed for Firestore to update, imageLink retrieves image
        mission.id = missionCallback.id;
        mission.imageLink = url;
        newMissions.push(mission);
        this.setState({
          futureMissions: newMissions
        });
      });
    }

    /* Callback to add Mission 
      if photo already in FireStorage, use it else upload new photo.
    */
    addMission = (mission) => {
      uploadImage(mission, this.uploadAndAddMission);
    }

    handleForm = (open) => {
      this.setState({
        openForm: open
      });
    }

    render() {
      const { classes } = this.props;
      let addMissionForm; // only render form when done loading!
      let data = [];

      let loading = (<CircularProgress className={classes.progress} />);
      // only display data if NOT loading
      if (!this.state.loading) {
          // show past
          if (this.state.showPast == 1) {
            data = this.state.pastMissions.map((mission) => (
              (<Grid key={mission.id} item xs={12} md={4} lg={3}>
                <Mission mission={mission} removeCallback={this.removeMission}/>
            </Grid>)));
          } else { // show present
            data = this.state.futureMissions.map((mission) => (
              (<Grid key={mission.id} item xs={12} md={4} lg={3}>
                <Mission mission={mission} removeCallback={this.removeMission}/>
            </Grid>)));
          }
          // needed to display empty Mission form
          let emptyMission = {
            description: '',
            endDate: now.unix(),
            imageLink: '',
            location: '',
            name: '',
            startDate: now.unix(),
            url: '',
          };
          addMissionForm = (<EditForm open={this.state.openForm}
            updateMission={this.addMission} mission={emptyMission}
            handleEdit={this.handleForm} update="false">
          </EditForm>);
      }

      return (
          <div>
            <Button className={classes.newMissionButton} variant="contained" 
            color="primary" onClick={() => this.handleForm(true)}>
              New Mission
            </Button>
            {!this.state.loading && addMissionForm}
            <Tabs
                classes={{
                  indicator: classes.indicator,
                  root: classes.tabs,
                }}
                value={this.state.showPast}
                onChange={this.tabChange}
                textColor='inherit'
                centered
              >
              <Tab label='Upcoming' classes={{
                root: classes.futureTab,
                selected: classes.selectedFuture,
                }}/>
              <Tab label='Past' classes={{
                root: classes.pastTab,
                selected: classes.selectedPast,
                }}/>
            </Tabs>
            <Grid container spacing={2} component={'div'} direction={'row'} justify={'center'}>
            {this.state.loading ? loading : data}
            </Grid>
          </div>
      );
    }
  }

    export default withStyles(styles)(Missions); 