import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';

import { db } from '../../src/firebase/firebaseSetup.js';
import CommunityGroup from './CommunityGroupsCard';

const styles = style => ({
  progress: {
    margin: style.spacing(2),
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
      yearTab: "All",
      genderTab: "All",
      loading: true,
    };

    this.getCommunityGroups = this.getCommunityGroups.bind(this);
  }

  componentDidMount() {
    this.getCommunityGroups();
  }

  // for filtering year & gender
  tabChange = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  generateOptions = (list) => {
    let l = [];
    for (let i = 0; i < list.length; i++) {
      l.push(<option value={list[i]}>{list[i]}</option>);
    }
    return l;
  }

  getCommunityGroups = () => {
    let cgs = [];
    // queries all data from CGs
    db.collection('communitygroups').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let cg = doc.data();
        cgs.push(cg);
      });
      this.setState({
        cgs,
        loading: false
      });
    });
  }

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
        <Grid container spacing={2} component={'div'} direction={'row'} justify={'center'}>
          {this.state.loading ? loading : data}
        </Grid>
        
      </div>

    );
  }
}

export default withStyles(styles)(CommunityGroups);