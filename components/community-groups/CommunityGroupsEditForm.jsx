import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, InputLabel, TextField, FormControl, 
  Dialog, DialogActions, DialogContent, DialogTitle,
  NativeSelect } from '@material-ui/core';

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
  cardControl: {
    width: '18vw',
    height: '20vw',
    minWidth: 275,
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
  },
  addLeaderButton: {
    float: 'right'
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

// ensure all Leaders Names aren't empty
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

  const [cgFinal, setCgFinal] = React.useState(cg);
  const [openEdit, setOpenEdit] = React.useState(false);

  useEffect(() => {
    setOpenEdit(open);
    setCgFinal(cg);
  }, [open], [cg]);

  const leaderOptions = generateOptionsByNames(users);
  const years = ["", "Freshman", "Sophomore", "Junior", "Senior"];
  const yearOptions = generateOptions(years);
  const gender = ["", "Male", "Female"];
  const genderOptions = generateOptions(gender);

  // onSubmit, verify, run async, and pass data back
  const handleSubmit = () => {
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
    updateCG(cgFinal);
    handleEdit(false);
  }

  const leaderSelectChange = (event, index) => {
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

  const addLeader = () => {
    var cgLeaders = cgFinal.leadersNames;
    cgLeaders.push('');
    setCgFinal({
      ...cgFinal,
      leadersNames: cgLeaders
    });
  }

  const removeLeader = () => {
    var cgLeaders = cgFinal.leadersNames;
    cgLeaders.splice(-1, 1); // remove last item
    setCgFinal({
      ...cgFinal,
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