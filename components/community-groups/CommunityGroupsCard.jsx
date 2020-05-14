import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent, Typography, Button, InputLabel, 
  TextField, FormControl
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import NativeSelect from '@material-ui/core/NativeSelect';
// EditableCG here
// import EditableEvent from '../editableEvent/EditableEvent';
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

const generateStringOfGroup = (group) => {
  var str = "";
  str += group[0];
  for (var i = 1; i < group.length; i++) {
    str += ", " + group[i];
  }
  return str;
}

const generateOptionsByNames = (users) => {
  let l = [];
  for (let i = 0; i < users.length; i++) {
    let name = users[i].name.first + " " + users[i].name.last;
    l.push(<option value={name}>{name}</option>);
  }
  return l;
}

// const buildLeaderSelects = (names, options) => {
//   let l = [];
//   for (let i = 0; i < names.length; i++) {
//     let name = users[i].name.first + " " + users[i].name.last;
//     l.push(
//       <div>
//         <InputLabel>Leaders</InputLabel>
//         <NativeSelect
//           value={name}
//           onChange={handleCloseEdit}
//           name='leadersNames'
//         >
//         {leaderOptions}
//         </NativeSelect>
//       </div>
//       );
//   }
//   return l;
// }

export default function CommunityGroupsCard(props) {
  const classes = useStyles();

  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRem] = React.useState(false);
  // const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const { cg, users } = props;

  const [cgFinal, setCgFinal] = React.useState({
    year: cg.year,
    leadersNames: cg.leadersNames,
    gender: cg.gender,
    day: cg.day,
    dorm: cg.dorm
  });

  const leaderOptions = generateOptionsByNames(users);
  const years = ["Freshman", "Sophomore", "Junior", "Senior"];
  const yearOptions = generateOptions(years);
  const gender = ["Male", "Female"];
  const genderOptions = generateOptions(gender);
  console.log("Year options are: ", yearOptions);

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
    console.log("Name change is: ", name);
    console.log("Value change is: ", value);
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
              fullWidth
            />
          <br/>
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