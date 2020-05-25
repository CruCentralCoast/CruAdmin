import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, InputLabel, TextField, FormControl
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import NativeSelect from '@material-ui/core/NativeSelect';

import { generateOptions } from '../Helpers';

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
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
  }
});

const generateOptionsByNames = (users) => {
  let l = [];
  for (let i = 0; i < users.length; i++) {
    let name = users[i].name.first + " " + users[i].name.last;
    l.push(<option value={name}>{name}</option>);
  }
  return l;
}

// ensure all Leaders Names aren't empty
const leadersNamesEmpty = (leaderNames) => {
  for (let i = 0; i < leaderNames; i++) {
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

  const [cgFinal, setCgFinal] = React.useState(cg);
  const [openEdit, setOpenEdit] = React.useState(false);

  useEffect(() => {
    setOpenEdit(open);
  }, [open]);

  const leaderOptions = generateOptionsByNames(users);
  const years = ["", "Freshman", "Sophomore", "Junior", "Senior"];
  const yearOptions = generateOptions(years);
  const gender = ["", "Male", "Female"];
  const genderOptions = generateOptions(gender);

  // onSubmit, verify, run async, and pass data back
  const handleSubmit = () => {
    // verify
    if (cgFinal.year === '') {
      alert('Year is empty');
      return;
    } else if (cgFinal.dorm === '') {
      alert('Location is empty');
      return;
    } else if (cgFinal.gender === '') {
      alert('Gender is empty');
      return;
    } else if (leadersNamesEmpty(cgFinal.leadersNames)){
      alert('One or more Leaders Names is empty');
      return;
    }
    console.log("Async submission");
    updateCG(cgFinal);
    handleEdit(false);
  }

  const indexSelectChange = (event, index) => {
    const value = event.target.value;
    var cgLeaders = cgFinal.leadersNames;
    cgLeaders[index] = value;
    setCgFinal({
      ...cgFinal, // necessary merging existing state with new state
      leadersNames: cgLeaders
    });
  }

  const selectChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCgFinal({
      ...cgFinal, // necessary merging existing state with new state
      [name]: value
    });
  }

  const leaderSelects = cg.leadersNames.map((name, index) => {
    return (<div>
      <InputLabel>Leaders</InputLabel>
      <NativeSelect
        value={name}
        onChange={(event) => indexSelectChange(event, index)}
        name={index}
      >
      {leaderOptions}
      </NativeSelect>
    </div> 
    );
  });

  return (
    <div>
      <Dialog open={openEdit} onClose={() => handleEdit(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit CG</DialogTitle>
        <DialogContent>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel>Year</InputLabel>
              <NativeSelect
                value={cgFinal.year}
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
                value={cgFinal.gender}
                onChange={selectChange}
                name='gender'
              >
                {genderOptions}
              </NativeSelect>
            </FormControl>
          </div>
          <br/>
          <FormControl className={classes.formControl}>
            {leaderSelects}
          </FormControl>
          <br/>
          <TextField
              autoFocus
              margin="dense"
              id="dorm"
              label="Meets at"
              value={cgFinal.dorm}
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