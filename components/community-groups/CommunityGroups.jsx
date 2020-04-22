import * as React from 'react';
import { db } from '../../src/firebase/firebaseSetup.js';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid, Tabs, Tab } from '@material-ui/core';
import CommunityGroup from './CommunityGroupsCard';
import CommunityGroupModel from '../../src/models/CommunityGroup';
import { inspect } from 'util';
const styles = style => ({
  root: {
    flexGrow: 1,
  },
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

class CommunityGroups extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      current: [],
      showEvent: false,
      tab: 0,
      eventID: '',
      loading: true,
    };

    db.collection('communitygroups').get().then(((querySnapshot) => {
        // TODO: add movement filter || section by movement
      let current = [];
      querySnapshot.forEach((doc) => {
        let temp = new CommunityGroupModel(doc);
        console.log("CG Data is: " + inspect(doc));
        current.push(temp);
      });
      this.setState({
        current: current,
        loading: false,
      });
    }).bind(this));
  }

  showEvent(id) {
    this.setState({
      showEvent: true,
      eventID: id,
    });
  }

  tabChange = (event, tab) => {
    this.setState({
    tab,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    console.log("Props is: " + JSON.stringify(this.props));

    let data = [];
    let loading = (<CircularProgress className={classes.progress} />);
    data = this.state.current.map((cg) => (
        (<Grid key={cg.id} item xs={12} md={4} lg={3}>
          {/* <PostLink key={event.id} event={event} /> */}
          <CommunityGroup cg={cg} />
      </Grid>)));

    return (
      <div>
        <Tabs
          classes={{
            indicator: classes.indicator,
            root: classes.tabs,
          }}
          value={this.state.tab}
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
      <Grid container spacing={3} component={'div'} direction={'row'}>
        {this.state.loading ? loading : data}
      </Grid>
      </div>

    );
  }
}

export default withStyles(styles)(CommunityGroups);