import * as React from 'react';
import { Button, Card, CardContent, makeStyles, Typography
} from '@material-ui/core';

import { db } from '../../src/firebase/firebaseSetup.js';
import { stringifyLeaderNames } from '../Helpers';
import EditForm from './CommunityGroupsEditForm';
import RemoveForm from '../form/RemoveForm';

const useStyles = makeStyles({
  buttonGroup: {
    alignItems: 'center'
  },
  cardControl: {
    width: '18vw',
    height: '20vw',
    minWidth: 250,
    minHeight: 300
  }
});

export default function CommunityGroupsCard(props) {
  const classes = useStyles();
  const { cg, users, removeCallback } = props;

  // form handlers
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRemove] = React.useState(false);

  // stores up to date values of cg
  const [currCG, setCurrCG] = React.useState(cg);

  currCG.leadersNamesString = stringifyLeaderNames(currCG.leadersNames);

  const removalText = () => {
    return (`Are you sure you would like to permanently remove this 
    Community Group led by ${currCG.leadersNamesString} ?`);
  }

  const handleEdit = (edit) => {
    setOpenEdit(edit);
  };

  const handleRemove = (remove) => {
    setOpenRemove(remove);
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
  // display a single CG Card (including edit/remove form)
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
          <Button variant="outlined" color="secondary" onClick={() => handleRemove(true)}>
            Remove CG
          </Button>
        </div>
      </Card>
      <EditForm open={openEdit} cg={currCG} 
      users={users} handleEdit={handleEdit} updateCG={updateCG}>
      </EditForm>
      <RemoveForm open={openRem} id={currCG.id} handleRemove={handleRemove} removeCallback={removeCallback}
      item="CG" removalText={removalText()}
      >
      </RemoveForm>
    </div>
  );
}