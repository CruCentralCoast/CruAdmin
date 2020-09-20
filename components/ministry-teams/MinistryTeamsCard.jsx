import * as React from 'react';
import {
  Button, Card, CardContent, CardMedia, makeStyles, Typography
} from '@material-ui/core';
import { db } from '../../src/firebase/firebaseSetup.js';
import { stringifyLeaderNames, uploadImage } from '../Helpers';
import { DESC_LIMIT } from '../constants';
import EditForm from './MinistryTeamsEditForm';
import RemoveForm from '../form/RemoveForm';

const useStyles = makeStyles({
  buttonGroup: {
    alignItems: 'center'
  },
  cardControl: {
    width: '18vw',
    minWidth: 250,
    minHeight: 125
  }
});

// Represents a single card of Ministry Team
export default function MinistryTeamsCard(props) {
  const classes = useStyles();
  const { mt, users, removeCallback } = props;

  // form handlers
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRemove] = React.useState(false);

  // stores up to date values of Ministry Team
  const [currMT, setCurrMT] = React.useState(mt);

  const truncString = (str) => {
    if (str.length > DESC_LIMIT) {
      return str.substring(0, DESC_LIMIT) + "...";
    }
    return str;
  }
  currMT.leadersNamesString = stringifyLeaderNames(currMT.leadersNames);

  const removalText = () => {
    return (`Are you sure you would like to permanently remove this Ministry Team: 
    ${currMT.name} led by ${currMT.leadersNamesString} ?`);
  }

  const handleEdit = (edit) => {
    setOpenEdit(edit);
  };

  const handleRemove = (remove) => {
    setOpenRemove(remove);
  };

  // updates the attributes in Firebase
  const updateMTInFirebase = (mt, url) => {
    db.collection("ministryteams").doc(mt.id).update({
      description: mt.description,
      imageLink: url,
      leadersNames: mt.leadersNames,
      name: mt.name
    }).then(() => {
      mt.imageLink = url;
      setCurrMT(mt);
    });
  }

  // Upon updating a MT, user can upload new photo 
  // (if photo already in FireStorage, use it) or keep old photo.
  const updateMT = (mt) => {
    // update new image if provided
    if (mt.image) {
      // upload image and update MT in Firebase
      uploadImage(mt, updateMTInFirebase);
    } else {
      updateMTInFirebase(mt, mt.imageLink)
    }
  }

  // display a single MT Card (including edit/remove form)
  return (
    <div>
      <Card className={classes.cardControl}>
        <CardMedia
          component="img"
          src={currMT.imageLink || '/static/event.png'}
          title={currMT.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {currMT.name}
          </Typography>
          <Typography component="p">
            {`Leaders: ${currMT.leadersNamesString}` || "TBD"}
          </Typography>
          <Typography component="p">
            {`Description: ${truncString(currMT.description)}` || "TBD"}
          </Typography>
        </CardContent>
        <div className={classes.buttonGroup}>
          <Button variant="outlined" color="primary" onClick={handleEdit}>
            Edit MT
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleRemove(true)}>
            Remove MT
          </Button>
        </div>
      </Card>
      <EditForm open={openEdit} mt={currMT} update="true"
        users={users} handleEdit={handleEdit} updateMT={updateMT}>
      </EditForm>
      <RemoveForm open={openRem} id={currMT.id} handleRemove={handleRemove} 
      removeCallback={removeCallback} item="Ministry Team" 
      removalText={removalText()}
      >
      </RemoveForm>
    </div>
  );
}