import * as React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';

import { db } from '../../src/firebase/firebaseSetup.js';
import CommunityGroup from './CommunityGroupsCard';

import { generateOptions } from '../Helpers';

const styles = style => ({
  root: {
    flexGrow: 1,
  },
  progress: {
    margin: style.spacing(2),
  },
  indicator: {
    display: 'none',
  },
  formControl: {
    margin: style.spacing(1),
    minWidth: 120,
  }
});

class CommunityGroups extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      cgs: [],
      users: [],
      userIds: [],
      showEvent: false,
      yearTab: "All",
      genderTab: "All",
      eventID: '',
      loading: true,
    };

    this.getCommunityGroups = this.getCommunityGroups.bind(this);
  }

  componentDidMount() {
    this.getCommunityGroups();
  }

  showEvent(id) {
    this.setState({
      showEvent: true,
      eventID: id,
    });
  }

  tabChange = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  getCommunityGroups = () => {
    // get all cgs
    var cgs = db.collection('communitygroups').get().then(
      (querySnapshot) => {
        var promises = [];
        querySnapshot.forEach((doc) => {
          let cg = doc.data();
          cg.id = doc.id;
          promises.push(cg);
        });
        return promises;
      }
    );
    // get all users
    var users = db.collection('users').get().then(
      (querySnapshot) => {
        var promises = [];
        querySnapshot.forEach((doc) => {
          let user = doc.data();
          user.id = doc.id;
          promises.push(user);
        });
        return promises;
      }
    );
  
    // combine both collections to pass to Cards
    Promise.all([cgs, users]).then((data) => {
      var cgs = data[0];
      var users = data[1];
      console.log("users: ", users);
      this.setState({
        users,
        cgs,
        loading: false
      });
    });
  }

  // // get all cgs
  // var cgs = db.collection('communitygroups').get().then(
  //   (querySnapshot) => {
  //     var promises = [];
  //     querySnapshot.forEach((doc) => {
  //       let cg = doc.data();
  //       promises.push([doc.id, cg]);
  //     });
  //     return promises;
  //   }
  // );
  // // get all users
  // var users = db.collection('users').get().then(
  //   (querySnapshot) => {
  //     var promises = [];
  //     querySnapshot.forEach((doc) => {
  //       let cg = doc.data();
  //       promises.push([doc.id, cg]);
  //     });
  //     return promises;
  //   }
  // );
  
  // // combine both collections to pass to Cards
  // Promise.all([cgs, users]).then((data) => {
  //   var cgs = data[0];
  //   var users = data[1];
  //   console.log("users: ", users);
  //   this.setState({
  //     users,
  //     cgs,
  //     loading: false
  //   });
  // });

  // filter based on list of [fieldName, fieldValue)]
  filterWithOptions = (options, cgs) => {
    let filteredData = cgs;
    // filter by each option 
    for (let i = 0; i < options.length; i++) {
      if (options[i][1] !== "All"){
        filteredData = filteredData.filter((cg) =>
          cg[options[i][0]] === options[i][1]);
      }
    }
    return filteredData;
  }

  render() {
    const { classes } = this.props;

    let data = [];
    let loading = (<CircularProgress className={classes.progress} />);
    // only display data if NOT loading
    if (!this.state.loading) {

      // filter
      let filteredData = this.filterWithOptions([["gender", this.state.genderTab], 
      ["year", this.state.yearTab]], this.state.cgs);

      data = filteredData.map((cg) => (
        (<Grid key={cg.id} item xs={12} md={4} lg={3}>
          {/* <PostLink key={event.id} event={event} /> */}
          <CommunityGroup cg={cg} users={this.state.users}/>
      </Grid>)));
    }

    // currently these years and genders are used
    const years = ["All", "Freshman", "Sophomore", "Junior", "Senior"];
    const yearOptions = generateOptions(years);
    const gender = ["All", "Male", "Female"];
    const genderOptions = generateOptions(gender);

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel>Year</InputLabel>
          <NativeSelect
            value={this.state.yearTab}
            onChange={this.tabChange}
            inputProps={{
              name: 'yearTab'
            }}
          >
            {yearOptions}
          </NativeSelect>
        <FormHelperText>Filter by year</FormHelperText>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Gender</InputLabel>
          <NativeSelect
            value={this.state.genderTab}
            onChange={this.tabChange}
            inputProps={{
              name: 'genderTab'
            }}
          >
            {genderOptions}
          </NativeSelect>
        <FormHelperText>Filter by gender</FormHelperText>
        </FormControl>
        <Grid container spacing={2} component={'div'} direction={'row'} justify={'center'}>
          {this.state.loading ? loading : data}
        </Grid>
        
      </div>

    );
  }
}

export default withStyles(styles)(CommunityGroups);