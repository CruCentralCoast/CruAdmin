import * as React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { db } from '../../src/firebase/firebaseSetup.js';
import CommunityGroup from './CommunityGroupsCard';
import CommunityGroupModel from '../../src/models/CommunityGroup';
import { getUserNameById } from '../Helpers';

const styles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  progress: {
    margin: theme.spacing(2),
  },
  indicator: {
    display: 'none',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));


class CommunityGroups extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      current: {},
      showEvent: false,
      tab: "Freshmen Male",
      eventID: '',
      loading: true,

      chick: []
    };

    db.collection('communitygroups').get().then(((querySnapshot) => {
        // TODO: add movement filter || section by movement
      let current = {};
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
        let parsed = doc.data();
        let leaders = parsed.leaders;
        console.log(getUserNameById(leaders[0].id));

        let temp = new CommunityGroupModel(doc);
        
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
      current["Freshmen Male"] = freshmanGuy;
      current["Freshmen Female"] = freshmanGirl;
      current["Sophomore Male"] = sophomoreGuy;
      current["Sophomore Female"] = sophomoreGirl;
      current["Junior Male"] = juniorGuy;
      current["Junior Female"] = juniorGirl;
      current["Senior Male"] = seniorGuy;
      current["Senior Female"] = seniorGirl;
      current["Rest"] = rest;
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
    this.setState({
      tab: event.target.value
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  getYearsAndGenders = (list) => {
    let l = [];
    for (let i = 0; i < list.length; i++) {
      l.push(<MenuItem value={list[i]}>{list[i]}</MenuItem>);
    }
    return l;
  }

  render() {
    const { classes } = this.props;

    let data = [];
    let loading = (<CircularProgress className={classes.progress} />);
    // only display data if NOT loading
    if (!this.state.loading) {
      console.log("Update tab: ", this.state.tab);
      console.log("list is: ", this.state.current[this.state.tab]);
      data = this.state.current[this.state.tab].map((cg) => (
        (<Grid key={cg.id} item xs={12} md={4} lg={3}>
          {/* <PostLink key={event.id} event={event} /> */}
          <CommunityGroup cg={cg} />
      </Grid>)));
    }

    // currently these are categories used
    const yearsAndGenders = ["Freshmen Male", "Freshmen Female", 
    "Sophomore Male", "Sophomore Female", "Junior Male", "Junior Female",
    "Senior Male", "Senior Female", "Rest"];
    const listItems = this.getYearsAndGenders(yearsAndGenders);

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Community Group</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.tab}
            onChange={this.tabChange}
          >
            {listItems}
          </Select>
        </FormControl>
        <Grid container spacing={3} component={'div'} direction={'row'}>
          {this.state.loading ? loading : data}
        </Grid>
      </div>

    );
  }
}

export default withStyles(styles)(CommunityGroups);