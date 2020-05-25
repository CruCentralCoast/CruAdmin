import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid, Button, InputLabel, 
  FormControl, NativeSelect, FormHelperText } from '@material-ui/core';

import { db } from '../../src/firebase/firebaseSetup.js';
import CommunityGroup from './CommunityGroupsCard';
import EditForm from './CommunityGroupsEditForm';

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
  },
  newCGbutton: {
    float: 'right'
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
      openForm: false,
    };

    this.getCommunityGroups = this.getCommunityGroups.bind(this);
    this.removeCG = this.removeCG.bind(this);
    this.handleForm = this.handleForm.bind(this);
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
      this.setState({
        users,
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

  removeCG = (id) => {
    db.collection("communitygroups").doc(id).delete()
    .then(() => {
        let cgs = this.state.cgs;
        // look for cg to remove
        for (let i = 0; i < cgs.length; i++) {
          if (cgs[i].id === id) {
            cgs.splice(i, 1);
            i--; // go back to index
          }
        }
        // set state to remove it
        this.setState({
          cgs
        });
    });
  }

  addCG = (cg) => {
    db.collection("communitygroups").add({
      dorm: cg.dorm,
      gender: cg.gender,
      leadersNames: cg.leadersNames,
      year: cg.year
    }).then((cgCallback) => {
      cg.id = cgCallback.id;
      let newCgs = this.state.cgs;
      newCgs.push(cg);
      this.setState({
        cgs: newCgs
      });
    });
  }

  handleForm = (open) => {
    this.setState({
      openForm: open
    });
  }

  render() {
    const { classes } = this.props;

    let addCGform;
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
          <CommunityGroup cg={cg} users={this.state.users} 
          removeCallback={this.removeCG}/>
      </Grid>)));

      let emptyCG = {
        dorm: '',
        gender: '',
        leadersNames: [''],
        year: ''
      };
      addCGform = (<EditForm open={this.state.openForm} users={this.state.users}
              updateCG={this.addCG} cg={emptyCG}
              handleEdit={this.handleForm}>
            </EditForm>);
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
        <Button className={classes.newCGbutton} variant="contained" 
        color="primary" onClick={() => this.handleForm(true)}>
          New CG
        </Button>
        {!this.state.loading && addCGform}

        <Grid container spacing={2} component={'div'} direction={'row'} justify={'center'}>
          {this.state.loading ? loading : data}
        </Grid>
        
      </div>

    );
  }
}

export default withStyles(styles)(CommunityGroups);