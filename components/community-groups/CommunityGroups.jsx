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
import { getUserNameById } from '../Helpers';

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

  render() {
    const { classes } = this.props;

    console.log("styles: ", classes.formControl);
    let data = [];
    let loading = (<CircularProgress className={classes.progress} />);
    // only display data if NOT loading
    if (!this.state.loading) {
      console.log("Gender tab: ", this.state.genderTab);
      console.log("Year tab: ", this.state.yearTab);
      // console.log("list is: ", this.state.current[this.state.tab]);
      // data = this.state.current[this.state.tab].map((cg) => (
      //   (<Grid key={cg.id} item xs={12} md={4} lg={3}>
      //     {/* <PostLink key={event.id} event={event} /> */}
      //     <CommunityGroup cg={cg} />
      // </Grid>)));
    }

    // currently these are categories used
    // const yearsAndGenders = ["Freshmen Male", "Freshmen Female", 
    // "Sophomore Male", "Sophomore Female", "Junior Male", "Junior Female",
    // "Senior Male", "Senior Female", "Rest"];
    // const listItems = this.getYearsAndGenders(yearsAndGenders);
    const years = ["All", "Freshman", "Sophomore", "Junior", "Senior"];
    const yearOptions = this.generateOptions(years);
    const gender = ["All", "Male", "Female"];
    const genderOptions = this.generateOptions(gender);
    // <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"
    //         value={this.state.yearTab}
    //         onChange={this.tabChange}
    //       >
            
    //       </Select>
    //     <FormControl className={classes.formControl}>
    //       <InputLabel shrink htmlFor="age-native-label-placeholder">
    //         Gender
    //       </InputLabel>
    //       <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"
    //         value={this.state.genderTab}
    //         onChange={this.tabChange}
    //       >
    //         {genderMenuItems}
    //       </Select>
    //     </FormControl>

    //     <NativeSelect
    //       value={state.age}
    //       onChange={handleChange}
    //       inputProps={{
    //         name: 'age',
    //         id: 'age-native-label-placeholder',
    //       }}
    //     >
    //       <option value="">None</option>
    //       <option value={10}>Ten</option>
    //       <option value={20}>Twenty</option>
    //       <option value={30}>Thirty</option>
    //     </NativeSelect>
    //     <FormHelperText>Label + placeholder</FormHelperText>
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