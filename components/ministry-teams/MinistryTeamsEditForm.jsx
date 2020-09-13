import React, { useEffect } from 'react';
import { Button,  Dialog, DialogActions, DialogContent, 
  DialogTitle, FormControl, Input, InputLabel, makeStyles,
  NativeSelect, TextField } from '@material-ui/core';

import { generateOptionsByNames } from '../Helpers';

const useStyles = makeStyles({
  formControl: {
    display: 'flex',
    flexDirection: 'row',
  }
});

// check all Leaders Names aren't empty
const leadersNamesEmpty = (leadersNames) => {
  for (let i = 0; i < leadersNames.length; i++) {
    if (leadersNames[i] === '') {
      return true;
    }
  }
  return false;
}

// checks if name contains a valid image extension
const checkEndsWithValidImageExt = (imageName) => {
  const validImageExts = [".jpg", ".png", ".jpeg", ".gif", ".bmp"];
  for (let i = 0; i < validImageExts.length; i++) {
    if (imageName.endsWith(validImageExts[i])) {
      return true;
    }
  }
  return false;
}

/* This edit form is used to add a new Ministry Team
   and update an old Ministry Team 
*/
export default function EditForm(props) {
  const classes = useStyles();
  const { open, mt, users, handleEdit, updateMT, update } = props;

  const [openEdit, setOpenEdit] = React.useState(false);
  const [currMT, setCurrMT] = React.useState(mt);

  // listens for changes and updates these states for render
  useEffect(() => {
    setOpenEdit(open);
    setCurrMT(mt);
  }, [open], [mt]);

  const leaderOptions = generateOptionsByNames(users);
  // onSubmit, verify, run async, and pass data back
  const handleSubmit = () => {
    // On an add, image required. On an edit, image not required (assuming not editing image)
    if (!currMT.imageLink && !currMT.image && !update) {
      alert('Must upload image');
      return;
    }
    // Must check if image extension is valid if image
    else if (currMT.image && !checkEndsWithValidImageExt(currMT.image.name)) {
      alert('Image must end with a valid image extension like jpg');
      return;
    }
    else if (currMT.description === '') {
      alert('Description is empty');
      return;
    } else if (leadersNamesEmpty(currMT.leadersNames)){
      alert('One or more Leaders Names is empty');
      return;
    } else if (currMT.name === '') {
      alert('Name is empty');
      return;
    }
    updateMT(currMT);
    handleEdit(false);
  }

  // handle leader change
  const leaderSelectChange = (event, index) => {
    const value = event.target.value;
    var mtLeaders = currMT.leadersNames;
    mtLeaders[index] = value;
    setCurrMT({
      ...currMT, // necessary merging existing state with new state
      leadersNames: mtLeaders
    });
  }

  // handle select change
  const selectChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrMT({
      ...currMT, // necessary merging existing state with new state
      [name]: value
    });
  }

  // adds a leader to list
  const addLeader = () => {
    var mtLeaders = currMT.leadersNames;
    mtLeaders.push(''); // selects empty option by default
    setCurrMT({
      ...currMT,
      leadersNames: mtLeaders
    });
  }

  // removes leader from list
  const removeLeader = () => {
    var mtLeaders = currMT.leadersNames;
    mtLeaders.splice(-1, 1); // remove last item
    setCurrMT({
      ...currMT,
      leadersNames: mtLeaders
    });
  }

  const leaderSelects = mt.leadersNames.map((name, index) => {
    return (
      <NativeSelect
        value={name}
        onChange={(event) => leaderSelectChange(event, index)}
        name={index}
      >
      {leaderOptions}
      </NativeSelect>
    );
  });

  // reads the file to be uploaded
  const readFile = (event) => {
      //  sets currMT.image
      setCurrMT({
        ...currMT,
        image: event.target.files[0]
      });
  }

  return (
    <div>
      <Dialog open={openEdit} onClose={() => handleEdit(false)}>
        <DialogTitle>Edit Ministry Team</DialogTitle>
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
              value={currMT.description}
              name="description"
              onChange={selectChange}
              fullWidth
            />
          </div>
          <br/>
          <FormControl className={classes.formControl}>
            <div>
              <InputLabel>Leaders</InputLabel>
              {leaderSelects}
              <Button variant="contained" color="primary" 
              onClick={addLeader}>
                +
              </Button>
              <Button variant="contained" color="secondary" 
              onClick={removeLeader}>
                -
              </Button>
            </div>
          </FormControl>
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              value={currMT.name}
              name="name"
              onChange={selectChange}
              fullWidth
            />
          <br/>
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