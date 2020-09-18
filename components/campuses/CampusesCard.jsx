import * as React from 'react';
import { Button, Card, CardContent, CardMedia, makeStyles, Typography
} from '@material-ui/core';
import { uploadImage } from '../Helpers';
import EditForm from './CampusesEditForm';
import RemoveForm from '../form/RemoveForm';

import { db } from '../../src/firebase/firebaseSetup.js';

const useStyles = makeStyles({
  cardControl: {
    width: '18vw',
    minWidth: 250,
    minHeight: 125
  }
});

// Represents a single card of a Campus
export default function CampusesCard(props) {
  const classes = useStyles();
  const { campus, removeCallback } = props;
  console.log("At load, campus is ", campus);
  // form handlers
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRemove] = React.useState(false);

  // stores up to date values of a Campus
  const [currCampus, setCurrCampus] = React.useState(campus);

  const removalText = () => {
    return (`Are you sure you would like to permanently remove this Campus: 
    ${currCampus.name} at ${currCampus.location.city} ?`);
  }

  const handleEdit = (edit) => {
    setOpenEdit(edit);
  };

  const handleRemove = (remove) => {
    setOpenRemove(remove);
  };

  const updateCampusInFirebase = (campus, url) => {
    console.log("During update Campus is: ", campus);
    db.collection("campuses").doc(campus.id).update({
      location: {
        city: campus.location.city,
        country: campus.location.country,
        number: campus.location.number,
        state: campus.location.state,
        street1: campus.location.street1,
        street2: campus.location.street2
      },
      imageLink: url,
      name: campus.name,
    }).then(() => {
      campus.imageLink = url;
      setCurrCampus(campus);
    });
  }

  const updateCampus = (campus) => {
    // update new image if provided
    if (campus.image) {
      // upload image and update Campus in Firebase
      uploadImage(campus, updateCampusInFirebase);
    } else {
      updateCampusInFirebase(campus, campus.imageLink)
    }
  }

  // display a single Campus Card (including edit/remove form)
  return (
    <div>
      <Card className={classes.cardControl}>
        <CardMedia
          component="img"
          src={currCampus.imageLink || '/static/event.png'}
          title={currCampus.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {currCampus.name}
          </Typography>
          <Typography component="p">
            {`Location: ${currCampus.location.city}, ${currCampus.location.country}` || "TBD"}
          </Typography>
        </CardContent>
        <div className={classes.buttonGroup}>
          <Button variant="outlined" color="primary" onClick={handleEdit}>
            Edit Campus
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleRemove(true)}>
            Remove Campus
          </Button>
        </div>
      </Card>
      <EditForm open={openEdit} campus={currCampus} update="true"
        handleEdit={handleEdit} updateCampus={updateCampus}>
      </EditForm>
      <RemoveForm open={openRem} id={currCampus.id} handleRemove={handleRemove} 
        removeCallback={removeCallback} item="Campus" 
        removalText={removalText()}>
      </RemoveForm>
    </div>
  );
} 