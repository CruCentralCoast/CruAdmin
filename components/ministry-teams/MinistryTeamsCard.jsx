import * as React from 'react';
import {
  Button, Card, CardContent, CardMedia, makeStyles, Typography
} from '@material-ui/core';

import { db, storage } from '../../src/firebase/firebaseSetup.js';

import { stringifyLeaderNames } from '../Helpers';
import { DESC_LIMIT } from '../constants';
import EditForm from './MinistryTeamsEditForm';

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
  const { mt, users } = props;

  // form handlers
  const [openEdit, setOpenEdit] = React.useState(false);

  // stores up to date values of Ministry Team
  const [currMT, setCurrMT] = React.useState(mt);

  const truncString = (str) => {
    if (str.length > DESC_LIMIT) {
      return str.substring(0, DESC_LIMIT) + "...";
    }
    return str;
  }
  currMT.leadersNamesString = stringifyLeaderNames(currMT.leadersNames);

  const handleEdit = (edit) => {
    setOpenEdit(edit);
  };

  const updateMTInFirebase = (mt, url) => {
    db.collection("ministryteams").doc(mt.id).update({
      description: mt.description,
      imageLink: url,
      leadersNames: mt.leadersNames,
      name: mt.name
    }).then(() => {
      // id needed for Firestore, imageLink retrieves image
      console.log("new mt is: ", mt);
      mt.imageLink = url;
      setCurrMT(mt);
    });
  }

  const updateMT = (mt) => {
    // try to update MT

    console.log("Update MT");
    console.log("mt is ", mt);
    // update new pic
    if (mt.pic) {
      // ref to image
      const imageRef = storage.ref().child(mt.pic.name);

      // if image already exists, reuse url
      imageRef.getDownloadURL().then((foundURL) => {
        updateMTInFirebase(mt, foundURL);
      }, () => {
        // since image doesn't exist, upload image
        console.warn("File ", mt.pic.name, " doesn't exist");
        const uploadTask = imageRef.put(mt.pic);
        // check on status of upload task
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storage
              .ref()
              .child(mt.pic.name)
              .getDownloadURL()
              .then(url => {
                updateMTInFirebase(mt, url);
              });
          }
        )
      });
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
            {"Leaders: " + (currMT.leadersNamesString || "TBD")}
          </Typography>
          <Typography component="p">
            {"Description: " + (truncString(currMT.description) || "TBD")}
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
    </div>
  );
}