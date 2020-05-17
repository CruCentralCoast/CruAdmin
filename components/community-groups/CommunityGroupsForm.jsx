import React, { useState, useEffect } from 'react';
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

export default function Form(props) {
  const classes = useStyles();
  const { open, cg, users, closeForm } = props;

  const [cgFinal, setCgFinal] = React.useState(cg);

  console.log("Props Open is ", open);
  const [openEdit, setOpenEdit] = React.useState(false);

  useEffect(() => {
    console.log("Props Open is ", open);
    setOpenEdit(open);
  }, [open]);


  console.log("State Open is ", openEdit);
  const leaderOptions = generateOptionsByNames(users);
  const years = ["Freshman", "Sophomore", "Junior", "Senior"];
  const yearOptions = generateOptions(years);
  const gender = ["Male", "Female"];
  const genderOptions = generateOptions(gender);
  console.log("Year options are: ", yearOptions);

  const handleCloseEdit = () => {
    console.log("Close edit called");
    // setOpenEdit(false);
    // pass data back to re-render
    closeForm();
  };

  // onSubmit, verify, run async, and pass data back
  const handleSubmit = () => {
    // verify
    console.log("Async submission");

    // pass back data
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
    // console.log("Name change is: ", name);
    // console.log("Value change is: ", value);
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

  console.log("Open edit ", openEdit);
  return (
    <div>
      <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="form-dialog-title">
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
              id="name"
              label="Meets at"
              type="email"
              value={cgFinal.dorm}
              name='dorm'
              onChange={selectChange}
              fullWidth
            />
          <br/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
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