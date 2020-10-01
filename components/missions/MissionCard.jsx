import * as React from 'react';
import { Button, Card, CardContent, CardMedia, Link, makeStyles, Typography
} from '@material-ui/core';
import { db, firebase } from '../../src/firebase/firebaseSetup.js';
import { uploadImage } from '../Helpers';
import EditForm from './MissionEditForm';
import RemoveForm from '../form/RemoveForm';

const useStyles = makeStyles({
  cardControl: {
    width: '18vw',
    minWidth: 250,
    minHeight: 125
  }
});

// Represents a single card of Mission
export default function MissionCard(props) {
  const classes = useStyles();
  const { mission, removeCallback } = props;

  // form handlers
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRemove] = React.useState(false);

  // stores up to date values of Mission
  const [currMission, setCurrMission] = React.useState(mission);

  const removalText = () => {
    return (`Are you sure you would like to permanently remove this Mission: 
    ${currMission.name} at ${currMission.location} ?`);
  }

  const handleEdit = (edit) => {
    setOpenEdit(edit);
  };

  const handleRemove = (remove) => {
    setOpenRemove(remove);
  };

  // updates the attributes in Firebase
  const updateMissionInFirebase = (mission, url) => {
    db.collection("missions").doc(mission.id).update({
        description: mission.description,
        endDate: new firebase.firestore.Timestamp(mission.endDate, 0),
        imageLink: url,
        location: mission.location,
        name: mission.name,
        startDate: new firebase.firestore.Timestamp(mission.startDate, 0),
        url: mission.url,
    }).then(() => {
        mission.imageLink = url;
        setCurrMission(mission);
    });
  }

  // Upon updating a Mission, user can upload new photo 
  // (if photo already in FireStorage, use it) or keep old photo.
  const updateMission = (mission) => {
    // update new image if provided
    if (mission.image) {
      // upload image and update Mission in Firebase
      uploadImage(mission, updateMissionInFirebase);
    } else {
      updateMissionInFirebase(mission, mission.imageLink)
    }
  }

  // display time and location
  return (
    <div>
      <Card className={classes.cardControl}>
        <CardMedia
          component="img"
          src={currMission.imageLink || '/static/event.png'}
          title={currMission.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {currMission.name}
          </Typography>
          <Typography component="p">
            {`Location: ${currMission.location}`}
          </Typography>
          <Typography component="p">
            {`Start Date: ${new Date(currMission.startDate*1000).toLocaleString()}`}
          </Typography>
          <Typography component="p">
            {`End Date: ${new Date(currMission.endDate*1000).toLocaleString()}`}
          </Typography>
          <Link href={currMission.url} onClick={(event) => {event.preventDefault(); window.open(currMission.url);}}>
            Click for more info
          </Link>
        </CardContent>
        <div className={classes.buttonGroup}>
          <Button variant="outlined" color="primary" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleRemove(true)}>
            Remove
          </Button>
        </div>
      </Card>
      <EditForm open={openEdit} mission={currMission} update="true"
        handleEdit={handleEdit} updateMission={updateMission}>
      </EditForm>
      <RemoveForm open={openRem} id={currMission.id} handleRemove={handleRemove} 
      removeCallback={removeCallback} item="Mission" 
      removalText={removalText()}>
      </RemoveForm>
    </div>
  );
} 