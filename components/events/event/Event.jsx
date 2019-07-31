import * as React from 'react';
import EditableEvent from '../editableEvent/EditableEvent';
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, Typography, Button, Grid } from '@material-ui/core';

const styles = style => ({
  root: {
    flexGrow: 1,
  },
  deleteButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#ffffff',
    backgroundColor: '#dd7d1b',
  },
  editButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#ffffff',
    backgroundColor: '#007398',
  },
  buttonGroup: {
    marginTop: '10px',
  },
});

class Event extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      id: props.event.id,
      name: props.event.name,
      description: props.event.description,
      image: props.event.image,
      locationName: props.event.location,
      address: {
        line1: null,
        line2: null,
        city: null,
        state: null,
        zip: null,
      },
      movements: props.event.movements,
      start: props.event.start,
      end: props.event.end,
      url: props.event.url,
    };

    this.openEdit = this.openEdit.bind(this);
    this.open = false;
  }

  openEdit() {
    this.open = true;
    console.log(this);
  }

  handleClose(value) {
    this.open = false;
    setSelectedValue(value);
  };

  render() {
    const { classes } = this.props;
    let now = moment().format('X');
    let editButton = (<Button key={`${this.state.id}-edit`} className={classes.editButton} onClick={this.openEdit}>Edit</Button>);
    let deleteButton = (<Button key={`${this.state.id}-delete`} className={classes.deleteButton}>Delete</Button>);
    let buttons;

    if (this.state.end > now) {
      buttons = [
        editButton,
        deleteButton
      ]
    } else if (this.state.start < now && now < this.state.end) {
      // An event should not be able to be deleted while it is in progress
      buttons = editButton
    } else {
      // The only option for events that have ended should be deletion
      buttons = deleteButton
    }

    let start = moment.unix(this.state.start);
    let end = moment.unix(this.state.end);
    return (
      <Card>
        <CardMedia
          // className={classes.media}
          component='img'
          src={this.state.image || '/static/event.png'}
          title={this.state.name}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {this.state.name}
          </Typography>
          <Typography variant='subtitle1' component='h3'>{start.format('MMMM D, YYYY h:mm a')}</Typography>
          <Typography component='p'>
            {this.state.description}
          </Typography>
          <Grid
            container={true}
            justify='space-evenly'
            className={classes.buttonGroup}
          >
            {buttons}
          </Grid>
        </CardContent>
        <EditableEvent event={this.state} open={this.open}></EditableEvent>
      </Card>
    );
  }
}

export default withStyles(styles)(Event);
