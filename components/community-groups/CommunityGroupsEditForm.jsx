import React, { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, 
  DialogTitle, FormControl, InputLabel, makeStyles, NativeSelect, 
  TextField } from '@material-ui/core';

import { generateOptions } from '../Helpers';

const useStyles = makeStyles({
  formControl: {
    display: 'flex',
    flexDirection: 'row',
  }
});

const generateOptionsByNames = (users) => {
  let l = [];
  l.push(<option value=''></option>); // Empty Option
  for (let i = 0; i < users.length; i++) {
    let name = users[i].name.first + " " + users[i].name.last;
    l.push(<option value={name}>{name}</option>);
  }
  return l;
}

// check all Leaders Names aren't empty
const leadersNamesEmpty = (leadersNames) => {
  for (let i = 0; i < leadersNames.length; i++) {
    if (leadersNames[i] === '') {
      return true;
    }
  }
  return false;
}

/* This edit form is used to add a new CG
   and update an old CG 
*/
export default function EditForm(props) {
  const classes = useStyles();
  const { open, cg, users, handleEdit, updateCG } = props;

  const [openEdit, setOpenEdit] = React.useState(false);
  const [currCG, setCurrCG] = React.useState(cg);

  // listens for changes and updates these states for render
  useEffect(() => {
    setOpenEdit(open);
    setCurrCG(cg);
  }, [open], [cg]);

  const leaderOptions = generateOptionsByNames(users);
  const years = ["", "Freshman", "Sophomore", "Junior", "Senior"];
  const yearOptions = generateOptions(years);
  const genders = ["", "Male", "Female"];
  const genderOptions = generateOptions(genders);
  const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", 
  "Friday", "Saturday", "Sunday"];
  const dayOptions = generateOptions(days);
  // onSubmit, verify, run async, and pass data back
  const handleSubmit = () => {
    // simple checks to see if empty
    if (currCG.year === '') {
      alert('Year is empty');
      return;
    } else if (currCG.gender === '') {
      alert('Gender is empty');
      return;
    } else if (leadersNamesEmpty(currCG.leadersNames)){
      alert('One or more Leaders Names is empty');
      return;
    } else if (currCG.day === '' || !currCG.day) {
      alert('Meets on is empty');
      return;
    } else if (currCG.dorm === '') {
      alert('Location is empty');
      return;
    }
    updateCG(currCG);
    handleEdit(false);
  }

  // handle leader change
  const leaderSelectChange = (event, index) => {
    const value = event.target.value;
    var cgLeaders = currCG.leadersNames;
    cgLeaders[index] = value;
    setCurrCG({
      ...currCG, // necessary merging existing state with new state
      leadersNames: cgLeaders
    });
  }

  // handle select change
  const selectChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCurrCG({
      ...currCG, // necessary merging existing state with new state
      [name]: value
    });
  }

  const addLeader = () => {
    var cgLeaders = currCG.leadersNames;
    cgLeaders.push(''); // selects empty option by default
    setCurrCG({
      ...currCG,
      leadersNames: cgLeaders
    });
  }

  const removeLeader = () => {
    var cgLeaders = currCG.leadersNames;
    cgLeaders.splice(-1, 1); // remove last item
    setCurrCG({
      ...currCG,
      leadersNames: cgLeaders
    });
  }

  const leaderSelects = cg.leadersNames.map((name, index) => {
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

  return (
    <div>
      <Dialog open={openEdit} onClose={() => handleEdit(false)}>
        <DialogTitle>Edit CG</DialogTitle>
        <DialogContent>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel>Year</InputLabel>
              <NativeSelect
                value={currCG.year}
                onChange={selectChange}
                name='year'
              >
                {yearOptions}
              </NativeSelect>
            </FormControl>
          </div>
          <br/>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel>Gender</InputLabel>
              <NativeSelect
                value={currCG.gender}
                onChange={selectChange}
                name='gender'
              >
                {genderOptions}
              </NativeSelect>
            </FormControl>
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
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel>Meets on</InputLabel>
              <NativeSelect
                value={currCG.day}
                onChange={selectChange}
                name='day'
              >
                {dayOptions}
              </NativeSelect>
            </FormControl>
          </div>
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="dorm"
              label="Meets at"
              value={currCG.dorm}
              name='dorm'
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