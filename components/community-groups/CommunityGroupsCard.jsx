import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent, Typography, Button
} from '@material-ui/core';

import { db } from '../../src/firebase/firebaseSetup.js';
import EditForm from './CommunityGroupsEditForm';
import RemoveForm from '../form/RemoveForm';

const useStyles = makeStyles({
  buttonGroup: {
    alignItems: 'center'
  },
  cardControl: {
    width: '18vw',
    height: '20vw',
    minWidth: 275,
  }
});

// generate String to display group of leaders
const stringifyLeaderNames = (group) => {
  var str = "";
  str += group[0];
  for (var i = 1; i < group.length; i++) {
    str += ", " + group[i];
  }
  return str;
}

export default function CommunityGroupsCard(props) {
  const classes = useStyles();
  const { cg, users, removeCallback } = props;

  // form handlers
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRem] = React.useState(false);

  // stores up to date values of cg
  const [currCG, setCurrCG] = React.useState(cg);

  currCG.leadersNamesString = stringifyLeaderNames(currCG.leadersNames);

  const handleEdit = (edit) => {
    setOpenEdit(edit);
  };

  const handleRem = (remove) => {
    setOpenRem(remove);
  };

  const updateCG = (cg) => {
    db.collection("communitygroups").doc(cg.id).update({
      day: cg.day,
      dorm: cg.dorm,
      gender: cg.gender,
      leadersNames: cg.leadersNames,
      year: cg.year
    }).then(() => {
      setCurrCG(cg);
    });
  }
  
  // display single CG Card (including edit/remove form)
  return (
    <div>
      <Card className={classes.cardControl}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {currCG.year}
          </Typography>
          <Typography component="p">
            {currCG.gender}
          </Typography>
          <Typography component="p">
            {"Leaders: " + (currCG.leadersNamesString || "TBD")}
          </Typography>
          <Typography component="p">
            {"Meets on: " + (currCG.day || "TBD")}
          </Typography>
          <Typography component="p">
            {"Location: " + (currCG.dorm || "TBD")}
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
      <EditForm open={openEdit} cg={currCG} 
      users={users} handleEdit={handleEdit} updateCG={updateCG}>
      </EditForm>
      <RemoveForm open={openRem} cg={currCG} handleRem={handleRem} removeCallback={removeCallback}>
      </RemoveForm>
    </div>
  );
}