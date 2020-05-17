import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent, Typography, Button
} from '@material-ui/core';

import EditForm from './CommunityGroupsEditForm';
import RemoveForm from '../form/RemoveForm';

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

export default function CommunityGroupsCard(props) {
  const classes = useStyles();
  const { cg, users } = props;

  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRem] = React.useState(false);
  const [cgFinal, setCgFinal] = React.useState(cg);

  // const [cgFinal, setCgFinal] = React.useState({
  //   year: cg.year,
  //   leadersNames: cg.leadersNames,
  //   gender: cg.gender,
  //   day: cg.day,
  //   dorm: cg.dorm
  // });

  cgFinal.leadersNamesString = generateStringOfGroup(cgFinal.leadersNames);

  const handleEdit = (edit) => {
    console.log("Edit clicked ", edit);
    setOpenEdit(edit);
  };

  const handleRem = (remove) => {
    console.log("Remove clicked ", remove);
    setOpenRem(remove);
  };

  const cgDataCallBack = (cg) => {
    console.log("New CG is ", cg);
    setCgFinal(cg);
  }

  // default to filtered to movement CRU
  return (
    <div>
      <Card className={classes.cardControl}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {cgFinal.year}
          </Typography>
          <Typography component="p">
            {cgFinal.gender}
          </Typography>
          <Typography component="p">
            {"Leaders: " + (cgFinal.leadersNamesString || "TBD")}
          </Typography>
          <Typography component="p">
            {"Meets on: " + (cgFinal.day || "TBD")}
          </Typography>
          <Typography component="p">
            {"Location: " + (cgFinal.dorm || "TBD")}
          </Typography>
        </CardContent>
        <div className={classes.buttonGroup}>
          <Button variant="outlined" color="primary" onClick={handleEdit}>
            Edit CG
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleRem(true)}>
            Remove CG
          </Button>
        </div>
      </Card>
      <EditForm open={openEdit} cg={cgFinal} 
      users={users} handleEdit={handleEdit} cgDataCallBack={cgDataCallBack}>
      </EditForm>
      <RemoveForm open={openRem} cg={cgFinal} handleRem={handleRem}>
      </RemoveForm>
    </div>
  );
}