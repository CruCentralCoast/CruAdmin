import * as React from 'react';
import { Button, Card, CardContent, CardMedia, Link, makeStyles, Typography
} from '@material-ui/core';
import firebase, { db } from '../../src/firebase/firebaseSetup.js';
import { uploadImage } from '../Helpers';
import EditForm from './ResourceEditForm';
import RemoveForm from '../form/RemoveForm';

const useStyles = makeStyles({
  cardControl: {
    width: '18vw',
    minWidth: 250,
    minHeight: 125
  }
});

// Represents a single card of Resource
export default function ResourceCard(props) {
  const classes = useStyles();
  const { resource, removeCallback } = props;

  // form handlers
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRem, setOpenRemove] = React.useState(false);

  // stores up to date values of Resource
  const [currResource, setCurrResource] = React.useState(resource);

  const removalText = () => {
    return (`Are you sure you would like to permanently remove this Resource: 
    ${currResource.title} ?`);
  }

  const handleEdit = (edit) => {
    setOpenEdit(edit);
  };

  const handleRemove = (remove) => {
    setOpenRemove(remove);
  };

  // updates the attributes in Firebase
  const updateResourceInFirebase = (resource, url) => {
    db.collection("resources").doc(resource.id).update({
        author: resource.author,
        date: new firebase.firestore.Timestamp(resource.date, 0),
        description: resource.description,
        imageLink: url,
        title: resource.title,
        url: resource.url,
    }).then(() => {
        resource.imageLink = url;
        setCurrResource(resource);
    });
  }

  // Upon updating a Resource, user can upload new photo 
  // (if photo already in FireStorage, use it) or keep old photo.
  const updateResource = (resource) => {
    // update new image if provided
    if (resource.image) {
      // upload image and update Resource in Firebase
      uploadImage(resource, updateResourceInFirebase);
    } else {
      updateResourceInFirebase(resource, resource.imageLink);
    }
  }

  // only return component if imageLink exists
  const displayImage = (resource) => {
      if (resource.imageLink !== '') {
          return (
          <CardMedia
            component="img"
            src={resource.imageLink}
            title={resource.title}
          />)
      }
  }

  // display time and location
  return (
    <div>
      <Card className={classes.cardControl}>
        {displayImage(currResource)}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {currResource.title}
          </Typography>
          <Typography component="p">
            {`Author: ${currResource.author}`}
          </Typography>
          <Typography component="p">
            {`Date: ${new Date(currResource.date*1000).toLocaleString()}`}
          </Typography>
          <Link href={currResource.url} onClick={(event) => {event.preventDefault(); window.open(currResource.url);}}>
            Click to view resource site
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
      <EditForm open={openEdit} resource={currResource}
        handleEdit={handleEdit} updateResource={updateResource}>
      </EditForm>
      <RemoveForm open={openRem} id={currResource.id} handleRemove={handleRemove} 
      removeCallback={removeCallback} item="Resource" 
      removalText={removalText()}>
      </RemoveForm>
    </div>
  );
} 