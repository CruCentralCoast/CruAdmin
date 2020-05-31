import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { generateOptions, getAllFromFirestore } from '../Helpers';

const styles = style => ({
    progress: {
      margin: style.spacing(2),
    },
    formControl: {
      margin: style.spacing(1),
      minWidth: 120,
    },
    newCGbutton: {
      float: 'right'
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
          return (<div>
              <p>Hello W</p>
          </div>);
      }
    }

    export default withStyles(styles)(MinistryTeams);