import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardMedia, CardContent, Typography, Button, Grid,
} from '@material-ui/core';
import { inspect } from 'util';
// EditableCG here
// import EditableEvent from '../editableEvent/EditableEvent';
import CommunityGroupModel from '../../src/models/CommunityGroup';

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

export default function CommunityGroupsCard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const { cg } = props;
  console.log("Props of CGS? " + inspect(cg));
  console.log("description " + cg.description);
//   function handleClickOpen() {
//     setOpen(true);
//   }

//   const handleClose = () => {
//     setOpen(false);
//     // setSelectedValue(value);
//   };

//   const now = moment();
//   const editButton = (<Button key={`${cg.id}-edit`} className={classes.editButton} onClick={handleClickOpen}>Edit</Button>);
//   const deleteButton = (<Button key={`${cg.id}-delete`} className={classes.deleteButton}>Delete</Button>);
//   let buttons;

//   if (event.end > now) {
//     buttons = [
//       editButton,
//       deleteButton,
//     ];
//   } else if (now.isAfter(event.start) && now.isBefore(event.end)) {
//     // An event should not be able to be deleted while it is in progress
//     buttons = editButton;
//   } else {
//     // The only option for events that have ended should be deletion
//     buttons = deleteButton;
//   }
  
  // TODO: partition by year and filter by movement
  // default to filtered to movement CRU
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {cg.name}
        </Typography>
        <Typography component="p">
          {cg.year}
        </Typography>
        <Typography component="p">
          {cg.gender}
        </Typography>
        <Typography component="p">
          {"Meets on: " + (cg.day || "TBD")}
        </Typography>
        <Typography component="p">
          {"Location: " + (cg.dorm || "TBD")}
        </Typography>
      </CardContent>
    </Card>
  );
}

// TODO: possibly add more specific validation functions
CommunityGroupsCard.propTypes = {
  cg: PropTypes.instanceOf(CommunityGroupModel).isRequired,
};