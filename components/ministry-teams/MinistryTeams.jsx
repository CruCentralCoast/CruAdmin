import * as React from 'react';
import { CircularProgress, Grid, withStyles} 
from '@material-ui/core';

import { getAllFromFirestore } from '../Helpers';
import MinistryTeam from './MinistryTeamsCard';

const styles = style => ({
    progress: {
      margin: style.spacing(2),
    }
  });

// This component is the base of CG tab
class MinistryTeams extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        mts: [], // stands for ministry teams
        loading: true,
      };
  
      this.getMinistryTeams = this.getMinistryTeams.bind(this);
    }
  
    componentDidMount() {
      this.getMinistryTeams();
    }
    
    getMinistryTeams = () => {
        // get all ministry teams
        var mts = getAllFromFirestore('ministryteams');
      
        // combine both collections to pass to Cards
        Promise.all([mts]).then((data) => {
          var mts = data[0];
    
          this.setState({
            mts,
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
            data = this.state.mts.map((mt) => (
                (<Grid key={mt.id} item xs={12} md={4} lg={3}>
                  {/* <PostLink key={event.id} event={event} /> */}
                  <MinistryTeam mt={mt} mts={this.state.mts}/>
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

    export default withStyles(styles)(MinistryTeams);