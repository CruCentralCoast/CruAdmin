import * as React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';

import { db } from '../../src/firebase/firebaseSetup.js';
import CommunityGroup from './CommunityGroupsCard';
import CommunityGroupModel from '../../src/models/CommunityGroup';
import { getUsers } from '../Helpers';

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
      showEvent: false,
      yearTab: "All",
      genderTab: "All",
      eventID: '',
      loading: true,
    };

    this.getUsers = this.getUsers.bind(this);
    this.getCommunityGroups = this.getCommunityGroups.bind(this);
  }

  componentDidMount() {
    this.getCommunityGroups();
    this.setState({
      loading: false
    });
  }

  showEvent(id) {
    this.setState({
      showEvent: true,
      eventID: id,
    });
  }

  tabChange = (event) => {
    const name = event.target.name;
    console.log("Tab name ", name);
    console.log("Tab val ", event.target.value);
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  generateOptions = (list) => {
    let l = [];
    for (let i = 0; i < list.length; i++) {
      l.push(<option value={list[i]}>{list[i]}</option>);
    }
    return l;
  }

  getUserNameById = (id) => {
    var users = [];
    db.collection("users").doc(id).get().then((doc) => {
      if (doc.exists) {
          var data = doc.data();
          var name = data.name.first + " " + data.name.last;
          users.push(name);
          console.log("user: ", users)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return users;
  }

  getUsers = (list) => {
    var users = [];
    var promises = []
    list.forEach((user) => {
        promises.push(this.getUserNameById(user.id));
    })
    // this.setState({loading: false});
    // console.log("Get users: ", users);
    return promises;
  }

  getCommunityGroups = () => {
    let cgs = [];
    // this should be a promise?
    db.collection('communitygroups').get().then(
      (querySnapshot) => {
      var promises = [];
      querySnapshot.forEach((doc) => {
        promises.push(this.getUsers(doc.data().leaders));

        // let cg = doc.data();
        // cg.leadersName = [];

        // var promises = [];
        // cg.leaders.forEach((user) => {
        //     promises.push(this.getUsers(user.id));
        // });

                
        // console.log("Leaders names: ", leadersNames);
        // // console.log("Get users: ", cg.leadersName);   
        // cgs.push(cg);
      });
      return Promise.all(promises);
    }).then((users) => {
      console.log("Users that came back: ", users);
      cgs.push(users);
    });
    return cgs;
}
  

  // filter based on list of [fieldName, fieldValue)]
  filterWithOptions = (options, cgs) => {
    console.log("Options: ", options);
    let filters = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i][1] !== "All"){
        filters.push(options[i]);
      }
    }
    if (filters.length === 0) {
      return cgs;
    }
    return [];
  }

  render() {
    const { classes } = this.props;

    console.log("styles: ", classes.formControl);
    let data = [];
    let loading = (<CircularProgress className={classes.progress} />);
    // only display data if NOT loading
    if (!this.state.loading) {
      console.log("Gender tab: ", this.state.genderTab);
      console.log("Year tab: ", this.state.yearTab);
      // filter
      let filteredData = this.filterWithOptions([["gender", this.state.genderTab], 
      ["year", this.state.yearTab]], this.state.cgs);

      console.log("filtered data ", filteredData);
      // console.log("list is: ", this.state.current[this.state.tab]);
      data = filteredData.map((cg) => (
        (<Grid key={cg.id} item xs={12} md={4} lg={3}>
          {/* <PostLink key={event.id} event={event} /> */}
          <CommunityGroup cg={cg} />
      </Grid>)));
    }

    // currently these years and genders are used
    const years = ["All", "Freshman", "Sophomore", "Junior", "Senior"];
    const yearOptions = this.generateOptions(years);
    const gender = ["All", "Male", "Female"];
    const genderOptions = this.generateOptions(gender);

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
        <Grid container spacing={3} component={'div'} direction={'row'}>
          {this.state.loading ? loading : data}
        </Grid>
      </div>

    );
  }
}

export default withStyles(styles)(CommunityGroups);