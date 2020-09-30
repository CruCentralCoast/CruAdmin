import * as React from 'react';
import { CircularProgress, Grid, Tab, Tabs, withStyles } from '@material-ui/core';
import * as moment from 'moment';
import { getAllFromFirestore } from '../Helpers';
import Mission from './MissionCard.jsx';

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
  });

// This component is the base of Missions tab
class Missions extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        loading: true,
        futureMissions: [],
        pastMissions: [],
        showPast: 0,
      };

      this.getMissions = this.getMissions.bind(this);
    }

    componentDidMount() {
      this.getMissions();
    }

    getMissions = () => {
      // get all missions
      var missions = getAllFromFirestore('missions');
      let now = moment();
      // combine both collections to pass to Cards
      Promise.all([missions]).then((data) => {
        var missions = data[0];
        // iterate through missions and check data
        var futureMissions = missions.filter(mission => now.valueOf() < mission.endDate.seconds);
        var pastMissions = missions.filter(mission => now.valueOf() > mission.endDate.seconds);
        console.log("now: ", now.valueOf());
        console.log("one: ", missions[0].endDate.seconds);
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
    };

    

    render() {
      const { classes } = this.props;
      let data = [];

      let loading = (<CircularProgress className={classes.progress} />);
      // only display data if NOT loading
      if (!this.state.loading) {
          // show past
          if (this.state.showPast === 1) {
            data = this.state.pastMissions.map((mission) => (
              (<Grid key={mission.id} item xs={12} md={4} lg={3}>
                <Mission mission={mission} />
            </Grid>)));
          } else { // show present
            data = this.state.futureMissions.map((mission) => (
              (<Grid key={mission.id} item xs={12} md={4} lg={3}>
                <Mission mission={mission} />
            </Grid>)));
          }
      }

      return (
          <div>
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