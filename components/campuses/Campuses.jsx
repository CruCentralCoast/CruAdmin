import * as React from 'react';
import { CircularProgress, Grid, withStyles } from '@material-ui/core';

import { getAllFromFirestore } from '../Helpers';
import Campus from './CampusesCard';

const styles = style => ({
    progress: {
      margin: style.spacing(2),
    }
  });

// This component is the base of Campuses tab
class Campuses extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        campuses: [],
        loading: true,
      };

      this.getCampuses = this.getCampuses.bind(this);
    }

    componentDidMount() {
      this.getCampuses();
    }

    getCampuses = () => {
        // get all campuses
        var campuses = getAllFromFirestore('campuses');
        
        // combine collections to pass to Campus Cards
        Promise.all([campuses]).then((data) => {
          var campuses = data[0];

          this.setState({
            campuses,
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
            data = this.state.campuses.map((campus) => (
                (<Grid key={campus.id} item xs={12} md={4} lg={3}>
                  <Campus campus={campus} />
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

    export default withStyles(styles)(Campuses); 