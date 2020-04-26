import * as React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardMedia, CardContent, Typography, Button, Grid,
} from '@material-ui/core';
import EditableEvent from '../editableEvent/EditableEvent';
import EventModel from '../../../src/models/Event';

const useStyles = makeStyles({
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

export default function Event(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const { event } = props;

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    // setSelectedValue(value);
  };

  const now = moment();
  const editButton = (<Button key={`${event.id}-edit`} className={classes.editButton} onClick={handleClickOpen}>Edit</Button>);
  const deleteButton = (<Button key={`${event.id}-delete`} className={classes.deleteButton}>Delete</Button>);
  let buttons;

  if (event.end > now) {
    buttons = [
      editButton,
      deleteButton,
    ];
  } else if (now.isAfter(event.start) && now.isBefore(event.end)) {
    // An event should not be able to be deleted while it is in progress
    buttons = editButton;
  } else {
    // The only option for events that have ended should be deletion
    buttons = deleteButton;
  }

  return (
    <Card>
      <CardMedia
        // className={classes.media}
        component="img"
        src={event.imageUrl || '/static/event.png'}
        title={event.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {event.name}
        </Typography>
        <Typography variant="subtitle1" component="h3">{event.start.format('MMMM D, YYYY h:mm a')}</Typography>
        <Typography component="p">
          {event.description}
        </Typography>
        <Grid
          container
          justify="space-evenly"
          className={classes.buttonGroup}
        >
          {buttons}
        </Grid>
      </CardContent>
      <EditableEvent event={event} open={open} onClose={handleClose} />
    </Card>
  );
}

// TODO: possibly add more specific validation functions
Event.propTypes = {
  event: PropTypes.instanceOf(EventModel).isRequired,
};
