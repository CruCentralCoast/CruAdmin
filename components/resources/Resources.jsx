import * as React from 'react';
import { Button, CircularProgress, Grid, withStyles } from '@material-ui/core';
import * as moment from 'moment';
import firebase, { db } from '../../src/firebase/firebaseSetup.js';
import { getAllFromFirestore, uploadImage } from '../Helpers';
import Resource from './ResourceCard';
import EditForm from './ResourceEditForm';

const styles = style => ({
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
    newResourceButton: {
      float: 'right'
    }
  });

const now = moment();

// This component is the base of Resources tab
class Resources extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        loading: true,
        openForm: false,
        resources: [],
      };

      this.getResources = this.getResources.bind(this);
      this.handleForm = this.handleForm.bind(this);
      this.removeResource = this.removeResource.bind(this);
    }

    componentDidMount() {
      this.getResources();
    }

    getResources = () => {
      // get all resources
      var resources = getAllFromFirestore('resources');
      // combine both collections to pass to Cards
      Promise.all([resources]).then((data) => {
        var resources = data[0];
        // unwrap the timestamp to be seconds
        for (var i = 0; i < resources.length; i++) {
          resources[i].date = resources[i].date.seconds;
        }
        // sort resources by descending date
        resources.sort((a, b) => b.date - a.date);
        this.setState({
          loading: false,
          resources
        });
      });
    }

    /* Callback to remove the Resource from those Resource's 
    displayed based on index */ 
    removeResource = (id) => {
      db.collection("resources").doc(id).delete().
        then(() => {
          let resources = this.state.resources.filter(
            resource => resource.id !== id);
          // set state to remove it
          this.setState({
            resources
          });
      });
    }

    /* uploads resource and re-renders resource view.
     URL is optional ("" if not provided)
    */
    uploadAndAddResource = (resource, url) => {
      var resources = this.state.resources;
      db.collection("resources").add({
        author: resource.author,
        date: new firebase.firestore.Timestamp(resource.date, 0),
        description: resource.description,
        imageLink: url,
        title: resource.title,
        url: resource.url,
      }).then((resourceCallback) => {
        // id needed for Firestore to update, imageLink retrieves image
        resource.id = resourceCallback.id;
        resource.imageLink = url;
        resources.splice(0, 0, resource); // (index, remove 0 items, item)
        this.setState({
            resources
        });
      });
    }

    /* Callback to add Resource 
      if photo already in FireStorage, use it else upload new photo.
    */
    addResource = (resource) => {
      // check if image/imagelink is provided, put in "" if not provided
      if (resource.image) { // contains image, need to upload
          uploadImage(resource, this.uploadAndAddResource);
      } else {
          this.uploadAndAddResource(resource, "");
      }
    }

    handleForm = (open) => {
      this.setState({
        openForm: open
      });
    }

    render() {
      const { classes } = this.props;
      let addResourceForm; // only render form when done loading!
      let data = [];

      let loading = (<CircularProgress className={classes.progress} />);
      // only display data if NOT loading
      if (!this.state.loading) {
          data = this.state.resources.map((resource) => (
            (<Grid key={resource.id} item xs={12} md={4} lg={3}>
            <Resource resource={resource} removeCallback={this.removeResource}/>
          </Grid>)));
          // needed to display empty Resource form
          let emptyResource = {
            author: '',
            date: now.unix(),
            description: '',
            imageLink: '',
            title: '',
            url: '',
          };
          addResourceForm = (<EditForm open={this.state.openForm}
            updateResource={this.addResource} resource={emptyResource}
            handleEdit={this.handleForm}>
          </EditForm>);
      }

      return (
          <div>
            <Button className={classes.newResourceButton} variant="contained" 
            color="primary" onClick={() => this.handleForm(true)}>
              New Resource
            </Button>
            {!this.state.loading && addResourceForm}
            <Grid container spacing={2} component={'div'} direction={'row'} justify={'center'}>
            {this.state.loading ? loading : data}
            </Grid>
          </div>
      );
    }
  }

    export default withStyles(styles)(Resources); 