import React, { useEffect } from 'react';
import { Button,  Dialog, DialogActions, DialogContent, 
  DialogTitle, Input, makeStyles, TextField } from '@material-ui/core';
import * as moment from 'moment';
import { checkEndsWithValidImageExt, isValidHttpUrl } from '../Helpers';

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

/* This edit form is used to add a new Mission
   and update an old Mission
*/
export default function EditForm(props) {
  const classes = useStyles();
  const { open, mission, handleEdit, updateMission, update } = props;

  const [openEdit, setOpenEdit] = React.useState(false);
  const [currMission, setCurrMission] = React.useState(mission);

  // listens for changes and updates these states for render
  useEffect(() => {
    setOpenEdit(open);
    setCurrMission(mission);
  }, [open], [mission]);

  /* onSubmit, verify, run async, and pass data back
    Can only add new missions
  */
  const handleSubmit = () => {
    // On an add, image required. On an edit, image not required (assuming not editing image)
    if (!currMission.imageLink && !currMission.image && !update) {
      alert('Must upload image');
      return;
    } // Must check if image extension is valid if image
    else if (currMission.image && !checkEndsWithValidImageExt(currMission.image.name)) {
      alert('Image must end with a valid image extension like jpg');
      return;
    } else if (currMission.description === '') {
      alert('Description is empty');
      return;
    } else if (currMission.name === '') {
      alert('Name is empty');
      return;
    } else if (currMission.location === '') {
      alert('Location must not be empty');
      return;
    } else if (!isValidHttpUrl(currMission.url)) {
      alert('Location must not be empty');
      return;
    }
    let now = moment();
    // TODO: confirm date is after right now,
    // convert date to epoch timestamp
    updateMission(currMission);
    handleEdit(false);
  }

  // handle select change
  const selectChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrMission({
      ...currMission, // necessary merging existing state with new state
      [name]: value
    });
  }

  // reads the file to be uploaded
  const readFile = (event) => {
      //  sets currMission.image
      setCurrMission({
        ...currMission,
        image: event.target.files[0]
      });
  }

  return (
    <div>
      <Dialog open={openEdit} onClose={() => handleEdit(false)}>
        <DialogTitle>Edit Mission</DialogTitle>
        <DialogContent>
          <div>
            <Input type="file"
                onChange={readFile}
                required='true'
            />
          </div>
          <br/>
          <div>
          <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              value={currMission.description}
              name="description"
              onChange={selectChange}
              fullWidth
            />
          </div>
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              value={currMission.name}
              name="name"
              onChange={selectChange}
              fullWidth
            />
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="location"
              label="Location"
              value={currMission.location}
              name="location"
              onChange={selectChange}
              fullWidth
            />
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="url"
              label="Url"
              value={currMission.url}
              name="url"
              onChange={selectChange}
              fullWidth
            />
          <br/>
          <form className={classes.container} noValidate>
            <TextField
                id="datetime-local"
                label="Start Date"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                className={classes.textField}
                InputLabelProps={{
                shrink: true,
                }}
            />
            <TextField
                id="datetime-local"
                label="End Date"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                className={classes.textField}
                InputLabelProps={{
                shrink: true,
                }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleEdit(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}