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
      current: {},
      showEvent: false,
      yearTab: "All",
      genderTab: "All",
      eventID: '',
      loading: true,
    };


    db.collection('communitygroups').get().then(((querySnapshot) => {
        // TODO: add movement filter || section by movement
      let current = [];
      // let freshmanGuy = [];
      // let freshmanGirl = [];
      // let sophomoreGuy = [];
      // let sophomoreGirl = [];
      // let juniorGuy = [];
      // let juniorGirl = [];
      // let seniorGuy = [];
      // let seniorGirl = [];
      // let rest = [];
      
      querySnapshot.forEach((doc) => {
        let parsed = doc.data();
        // let leaders = parsed.leaders;
        // console.log(getUserNameById(leaders[0].id));
        parsed.leaders = getUsers(parsed.leaders);
        // let temp = new CommunityGroupModel(doc);
        
        console.log("one datapt : ", parsed);
        current.push(parsed);
        // if (temp.year === 'Freshman') {
        //   if (temp.gender === 'Male') {
        //     freshmanGuy.push(temp);
        //   } else {
        //     freshmanGirl.push(temp);
        //   }
        // } else if (temp.year === 'Sophomore') {
        //   if (temp.gender === 'Male') {
        //     sophomoreGuy.push(temp);
        //   } else {
        //     sophomoreGirl.push(temp);
        //   }
        // } else if (temp.year === 'Junior') {
        //   if (temp.gender === 'Male') {
        //     juniorGuy.push(temp);
        //   } else {
        //     juniorGirl.push(temp);
        //   }
        // } else if (temp.year === 'Senior') {
        //   if (temp.gender === 'Male') {
        //     seniorGuy.push(temp);
        //   } else {
        //     seniorGirl.push(temp);
        //   }
        // } else {
        //   rest.push(temp);
        // }
      });
      // current["Freshmen Male"] = freshmanGuy;
      // current["Freshmen Female"] = freshmanGirl;
      // current["Sophomore Male"] = sophomoreGuy;
      // current["Sophomore Female"] = sophomoreGirl;
      // current["Junior Male"] = juniorGuy;
      // current["Junior Female"] = juniorGirl;
      // current["Senior Male"] = seniorGuy;
      // current["Senior Female"] = seniorGirl;
      // current["Rest"] = rest;
      console.log("Current: ", current);
      this.setState({
        current: current,
        loading: false
      });
    }).bind(this));
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

  // getUsers = (list) => {
  //   let users = [];
  //   for (let i = 0; i < list.length; i++) {
  //     console.log("id: ", list[i].id);
  //     db.collection("users").doc(list[i].id).get().then(function(doc) {
  //       if (doc.exists) {
  //           // console.log("got data ", doc.data());
  //           var data = doc.data();
  //           var name = data.name.first + " " + data.name.last;
  //           users.push(name);
  //       } else {
  //           // doc.data() will be undefined in this case
  //           console.log("No such document!");
  //       }
  //     }).catch(function(error) {
  //         console.log("Error getting document:", error);
  //     });
  //   }
  //   return users;
  // }

  // getUserNameById = (id) => {
  //   // var docRef = ;
  //   // console.log("Doc ref: ", docRef);
  //   db.collection("users").doc(id).get().then(function(doc) {
  //     if (doc.exists) {
  //         // console.log("got data ", doc.data());
  //         var data = doc.data();
  //         var name = data.name.first + " " + data.name.last;
  //         return name;
  //     } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //     }
  //   }).catch(function(error) {
  //       console.log("Error getting document:", error);
  //   });
  //   return "Invalid User";
  // }
  // filterWithOptions = (options) => {

  // }

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

      // console.log("list is: ", this.state.current[this.state.tab]);
      // data = this.state.current[this.state.tab].map((cg) => (
      //   (<Grid key={cg.id} item xs={12} md={4} lg={3}>
      //     {/* <PostLink key={event.id} event={event} /> */}
      //     <CommunityGroup cg={cg} />
      // </Grid>)));
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