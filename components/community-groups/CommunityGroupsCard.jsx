import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardActions, CardContent, Typography, Button, Grid,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// EditableCG here
// import EditableEvent from '../editableEvent/EditableEvent';
import CommunityGroupModel from '../../src/models/CommunityGroup';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
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
    alignItems: 'center'
  },
  cardControl: {
    width: '18vw',
    height: '20vw',
    minWidth: 275,
  }
});

const generateStringOfGroup = (group) => {
  var str = "";
  str += group[0];
  for (var i = 1; i < group.length; i++) {
    str += ", " + group[i];
  }
  return str;
}

export default function CommunityGroupsCard(props) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRem] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const { cg } = props;
  cg.leadersNamesString = generateStringOfGroup(cg.leadersNames);

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleClickOpenRem = () => {
    setOpenRem(true);
  };

  const handleCloseRem = (remove) => {
    console.log("Remove CG ", remove);
    setOpenRem(false);
  };
  
  // default to filtered to movement CRU
  return (
    <div>
      <Card className={classes.cardControl}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {cg.year}
          </Typography>
          <Typography component="p">
            {cg.gender}
          </Typography>
          <Typography component="p">
            {"Leaders: " + (cg.leadersNamesString || "TBD")}
          </Typography>
          <Typography component="p">
            {"Meets on: " + (cg.day || "TBD")}
          </Typography>
          <Typography component="p">
            {"Location: " + (cg.dorm || "TBD")}
          </Typography>
        </CardContent>
        <div className={classes.buttonGroup}>
          <Button variant="outlined" color="primary" onClick={handleClickOpenEdit}>
            Edit CG
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClickOpenRem}>
            Remove CG
          </Button>
        </div>
      </Card>
      <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseEdit} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRem} onClose={() => handleCloseRem(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Remove CG</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you would like to permanently remove CG?
            <br />
            Led by {cg.leadersNamesString}
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseRem(true)} color="primary">
            Yes
          </Button>
          <Button onClick={() => handleCloseRem(false)} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

// TODO: possibly add more specific validation functions
// CommunityGroupsCard.propTypes = {
//   cg: PropTypes.instanceOf(CommunityGroupModel).isRequired,
// };