import * as React from 'react';
import { Button, CircularProgress, Grid, withStyles } from '@material-ui/core';

import { db } from '../../src/firebase/firebaseSetup.js';
import { getAllFromFirestore, uploadImage } from '../Helpers';
import Campus from './CampusesCard';
import EditForm from './CampusesEditForm';

const styles = style => ({
    progress: {
      margin: style.spacing(2),
    },
    formControl: {
      margin: style.spacing(1),
      minWidth: 120,
    },
    newCampusbutton: {
      float: 'right'
    }
});

// This component is the base of Campuses tab
class Campuses extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        campuses: [],
        loading: true,
        openForm: false,
      };

      this.getCampuses = this.getCampuses.bind(this);
      this.handleForm = this.handleForm.bind(this);
      this.removeCampus = this.removeCampus.bind(this);
    }

    componentDidMount() {
      this.getCampuses();
    }

    getCampuses = () => {
        // get all campuses
        var campuses = getAllFromFirestore('campuses');
        
        // combine collections to pass to Campus Cards
        Promise.all([campuses]).then((data) => {
          var campuses = data[0];
          console.log("campuses are ", campuses);
          this.setState({
            campuses,
            loading: false
          });
        });
    }

    // uploads campus and re-renders campus view
    uploadAndAddCampus = (campus, url) => {
      console.log("to be uploaded: ", campus);
      var newCampuses = this.state.campuses;
      db.collection("campuses").add({
        location: {
          city: campus.location.city,
          country: campus.location.country,
          number: campus.location.number,
          state: campus.location.state,
          street1: campus.location.street1,
          street2: campus.location.street2
        },
        imageLink: url,
        name: campus.name
      }).then((campusCallback) => {
        // id needed for Firestore to update, imageLink retrieves image
        campus.id = campusCallback.id;
        campus.imageLink = url;
        newCampuses.push(campus);
        this.setState({
          campuses: newCampuses
        });
      });
    }

      /* Callback to remove the Campuse from those Campuses 
      displayed based on index */ 
    removeCampus = (id) => {
      db.collection("campuses").doc(id).delete().
      then(() => {
          let campuses = this.state.campuses;
          // look for campuse to remove
          for (let i = 0; i < campuses.length; i++) {
            if (campuses[i].id === id) {
              campuses.splice(i, 1);
              break;
            }
          }
          // set state to remove it
          this.setState({
            campuses
          });
      });
    }

   /* Callback to add Campus 
    if photo already in FireStorage, use it else upload new photo.
   */
    addCampus = (campus) => {
        uploadImage(campus, this.uploadAndAddCampus);
    }

    handleForm = (open) => {
        this.setState({
          openForm: open
        });
    }

    render() {
    const { classes } = this.props;
    let addCampusForm; // only render form when done loading!
    let data = [];

    let loading = (<CircularProgress className={classes.progress} />);
    // only display data if NOT loading
    if (!this.state.loading) {
        data = this.state.campuses.map((campus) => (
            (<Grid key={campus.id} item xs={12} md={4} lg={3}>
                <Campus campus={campus}
                removeCallback={this.removeCampus}/>
            </Grid>)));
        let emptyCampus = {
          location: {
            city: '',
            country: '',
            number: '',
            state: '',
            street1: '',
            street2: '',
          },
          imageLink: '',
          name: ''
        };
        addCampusForm = (<EditForm open={this.state.openForm} updateCampus={this.addCampus} 
          campus={emptyCampus} handleEdit={this.handleForm} update="false">
        </EditForm>);
    }

    return (
        <div>
            <Button className={classes.newCampusbutton} variant="contained" 
            color="primary" onClick={() => this.handleForm(true)}>
              New Campus
            </Button>
            {!this.state.loading && addCampusForm}
            <Grid container spacing={2} component={'div'} direction={'row'} justify={'center'}>
            {this.state.loading ? loading : data}
            </Grid>
        </div>
    );
  }
}

export default withStyles(styles)(Campuses); 