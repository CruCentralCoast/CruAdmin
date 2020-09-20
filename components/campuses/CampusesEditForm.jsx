import React, { useEffect } from 'react';
import { Button,  Dialog, DialogActions, DialogContent, 
  DialogTitle, Input, TextField } from '@material-ui/core';
import { checkEndsWithValidImageExt } from '../Helpers';

/* This edit form is used to add a new Campus
   and update an old Campus
*/
export default function EditForm(props) {
  const { open, campus, handleEdit, updateCampus, update } = props;

  const [openEdit, setOpenEdit] = React.useState(false);
  const [currCampus, setCurrCampus] = React.useState(campus);

  // listens for changes and updates these states for render
  useEffect(() => {
    setOpenEdit(open);
    setCurrCampus(campus);
  }, [open], [campus]);

  // onSubmit, verify, run async, and pass data back
  const handleSubmit = () => {
    // On an add, image required. On an edit, image not required (assuming not editing image)
    if (!currCampus.imageLink && !update) {
      alert('Must upload image');
      return;
    }
    // Must check if image extension is valid if image
    else if (currCampus.image && !checkEndsWithValidImageExt(currCampus.image.name)) {
      alert('Image must end with a valid image extension like jpg');
      return;
    } else if (currCampus.location.city === '') {
      alert('City is empty');
      return;
    } else if (currCampus.location.country === '') {
      alert('Country is empty');
      return;
    } else if (currCampus.location.state === '') {
      alert('State is empty');
      return;
    } else if (currCampus.name === '') {
      alert('Name is empty');
      return;
    }
    updateCampus(currCampus);
    handleEdit(false);
  }

  // handle select change
  const selectChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrCampus({
      ...currCampus, // necessary merging existing state with new state
      [name]: value
    });
  }

  // handle location attribute changes
  const handleLocationChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrCampus({
      ...currCampus,
      location: {
        ...currCampus.location, // necessary merging existing state with new state
        [name]: value
      }
    });
  }

  // reads the file to be uploaded
  const readFile = (event) => {
    //  sets currCampus.image
    setCurrCampus({
      ...currCampus,
      image: event.target.files[0]
    });
  }

  return (
    <div>
      <Dialog open={openEdit} onClose={() => handleEdit(false)}>
        <DialogTitle>Edit Campus</DialogTitle>
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
              id="city"
              label="city"
              value={currCampus.location.city}
              name="city"
              onChange={handleLocationChange}
              fullWidth
            />
          </div>
          <br/>
          <div>
          <TextField
              autoFocus
              margin="dense"
              id="country"
              label="country"
              value={currCampus.location.country}
              name="country"
              onChange={handleLocationChange}
              fullWidth
            />
          </div>
          <br/>
          <div>
          <TextField
              autoFocus
              margin="dense"
              id="number"
              label="number"
              value={currCampus.location.number}
              name="number"
              onChange={handleLocationChange}
              fullWidth
            />
          </div>
          <br/>
          <div>
          <TextField
              autoFocus
              margin="dense"
              id="state"
              label="state"
              value={currCampus.location.state}
              name="state"
              onChange={handleLocationChange}
              fullWidth
            />
          </div>
          <br/>
          <div>
          <TextField
              autoFocus
              margin="dense"
              id="street1"
              label="street1"
              value={currCampus.location.street1}
              name="street1"
              onChange={handleLocationChange}
              fullWidth
            />
          </div>
          <br/>
          <div>
          <TextField
              autoFocus
              margin="dense"
              id="street2"
              label="street2"
              value={currCampus.location.street2}
              name="street2"
              onChange={handleLocationChange}
              fullWidth
            />
          </div>
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              value={currCampus.name}
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