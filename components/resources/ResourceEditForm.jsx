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

/* This edit form is used to add a new Resource
   and update an old Resource
*/
export default function EditForm(props) {
  const classes = useStyles();
  const { open, resource, handleEdit, updateResource } = props;

  const [openEdit, setOpenEdit] = React.useState(false);
  const [currResource, setCurrResource] = React.useState(resource);

  // listens for changes and updates these states for render
  useEffect(() => {
    setOpenEdit(open);
    setCurrResource(resource);
  }, [open], [resource]);

  // onSubmit, verify, run async, and pass data back
  const handleSubmit = () => {
    let now = moment();
    // if image: Must check if image extension is valid
    if (currResource.image && !checkEndsWithValidImageExt(currResource.image.name)) {
      alert('Image must end with a valid image extension like jpg');
      return;
    } else if (currResource.description === '') {
      alert('Description is empty');
      return;
    } else if (currResource.title === '') {
      alert('Title is empty');
      return;
    } else if (!isValidHttpUrl(currResource.url)) {
      alert('Url must be http/https');
      return;
    }
    updateResource(currResource);
    handleEdit(false);
  }

  // handle select change
  const selectChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrResource({
      ...currResource, // necessary merging existing state with new state
      [name]: value
    });
  }

  // handle time change
  const timeChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrResource({
        ...currResource,
        [name]: new moment(value).unix()
    });
  }

  // reads the file to be uploaded
  const readFile = (event) => {
      //  sets currResource.image
      setCurrResource({
        ...currResource,
        image: event.target.files[0]
      });
  }

  return (
    <div>
      <Dialog open={openEdit} onClose={() => handleEdit(false)}>
        <DialogTitle>Edit Resource</DialogTitle>
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
              value={currResource.description}
              name="description"
              onChange={selectChange}
              fullWidth
            />
          </div>
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="author"
              label="Author"
              value={currResource.author}
              name="author"
              onChange={selectChange}
              fullWidth
            />
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              value={currResource.title}
              name="title"
              onChange={selectChange}
              fullWidth
            />
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="url"
              label="Url"
              value={currResource.url}
              name="url"
              onChange={selectChange}
              fullWidth
            />
          <br/>
          <br/>
          <form className={classes.container} noValidate>
            <TextField
                id="datetime-local"
                label="Date"
                type="datetime-local"
                name="date"
                defaultValue={new moment(currResource.date*1000).format("YYYY-MM-DDTHH:mm")}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={timeChange}
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