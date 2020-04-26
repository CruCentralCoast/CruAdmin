import * as React from 'react';
import { db } from '../../src/firebase/firebaseSetup.js';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid, Tabs, Tab } from '@material-ui/core';
import CommunityGroup from './CommunityGroupsCard';
import CommunityGroupModel from '../../src/models/CommunityGroup';
const styles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  progress: {
    margin: theme.spacing(2),
  },
  tabs: {
    marginBottom: '20px',
  },
  indicator: {
    display: 'none',
  },
  // futureTab: {
  //   // borderRadius: "30px 0px 0px 30px",
  //   backgroundColor: '#f0efef',
  // },
  selectedTab: {
    backgroundColor: '#f9b625',
    color: '#f0efef',
  },
  // pastTab: {
  //   // borderRadius: "0px 30px 30px 0px",
  //   backgroundColor: '#f0efef',
  // },
  notSelectedTab: {
    backgroundColor: '#f9b625',
    color: '#f0efef',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  }
}));

class CommunityGroups extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      current: [],
      showEvent: false,
      tab: 0,
      eventID: '',
      loading: true,
      chick: []
    };

    db.collection('communitygroups').get().then(((querySnapshot) => {
        // TODO: add movement filter || section by movement
      let current = [];
      let freshmanGuy = [];
      let freshmanGirl = [];
      let sophomoreGuy = [];
      let sophomoreGirl = [];
      let juniorGuy = [];
      let juniorGirl = [];
      let seniorGuy = [];
      let seniorGirl = [];
      let rest = [];
      querySnapshot.forEach((doc) => {
        let temp = new CommunityGroupModel(doc);
        console.log(temp.year);
        console.log(temp.gender);
        if (temp.year === 'Freshman') {
          if (temp.gender === 'Male') {
            freshmanGuy.push(temp);
          } else {
            freshmanGirl.push(temp);
          }
        } else if (temp.year === 'Sophomore') {
          if (temp.gender === 'Male') {
            sophomoreGuy.push(temp);
          } else {
            sophomoreGirl.push(temp);
          }
        } else if (temp.year === 'Junior') {
          if (temp.gender === 'Male') {
            juniorGuy.push(temp);
          } else {
            juniorGirl.push(temp);
          }
        } else if (temp.year === 'Senior') {
          if (temp.gender === 'Male') {
            seniorGuy.push(temp);
          } else {
            seniorGirl.push(temp);
          }
        } else {
          rest.push(temp);
        }
      });
      current.push(freshmanGuy);
      current.push(freshmanGirl);
      current.push(sophomoreGuy);
      current.push(sophomoreGirl);
      current.push(juniorGuy);
      current.push(juniorGirl);
      current.push(seniorGuy);
      current.push(seniorGirl);
      current.push(rest);
      this.setState({
        current: current,
        loading: false,
        chick: current
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
    console.log("Tab: ", tab);
    console.log(event);
    this.setState({
      tab,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    // console.log("Props is: " + JSON.stringify(this.props));

    let data = [];
    let loading = (<CircularProgress className={classes.progress} />);
    // // if (this.state.tab)
    // console.log(this.state.tab);
    // console.log("Chick: ", this.state.chick[0]);
    // const l = this.state.chick[this.state.tab];
    // console.log(l);
    // only display data if NOT loading
    if (!this.state.loading) {
      data = this.state.current[this.state.tab].map((cg) => (
        (<Grid key={cg.id} item xs={12} md={4} lg={3}>
          {/* <PostLink key={event.id} event={event} /> */}
          <CommunityGroup cg={cg} />
      </Grid>)));
    }
    

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
          // root: classes.futureTab,
          selected: classes.selectedTab,
          }}/>
        <Tab label='Past' classes={{
          // root: classes.pastTab,
          selected: classes.notSelectedTab,
          }}/>
        <Tab label='Past' classes={{
          // root: classes.pastTab,
          selected: classes.notSelectedTab,
          }}/>
        <Tab label='Past' classes={{
          // root: classes.pastTab,
          selected: classes.notSelectedTab,
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