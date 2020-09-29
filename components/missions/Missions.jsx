import * as React from 'react';
import { CircularProgress, Grid, withStyles } from '@material-ui/core';

import { getAllFromFirestore } from '../Helpers';
import Mission from './MissionCard.jsx';

const styles = style => ({
    progress: {
      margin: style.spacing(2),
    }
  });

// This component is the base of Missions tab
class Missions extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        missions: [],
        loading: true,
      };

      this.getMissions = this.getMissions.bind(this);
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

          this.setState({
            missions,
            loading: false
          });
        });
      }

      render() {
        const { classes } = this.props;
        let data = [];

        let loading = (<CircularProgress className={classes.progress} />);
        // only display data if NOT loading
        if (!this.state.loading) {
            data = this.state.missions.map((mission) => (
                (<Grid key={mission.id} item xs={12} md={4} lg={3}>
                  {/* <PostLink key={event.id} event={event} /> */}
                  <Mission mission={mission} />
              </Grid>)));
        }

        return (
            <div>
                <Grid container spacing={2} component={'div'} direction={'row'} justify={'center'}>
                {this.state.loading ? loading : data}
                </Grid>
            </div>
        );
      }
    }

    export default withStyles(styles)(Missions); 