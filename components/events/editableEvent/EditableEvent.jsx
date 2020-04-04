import * as React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  ButtonBase,
  Typography,
  CardMedia,
  LinearProgress,
  Checkbox,
} from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { DateTimeField } from '../../form/DateTimeField';
import EventModel from '../../../src/models/Event';

const useStyles = makeStyles({
  submitButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#ffffff',
    backgroundColor: '#007398',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    // marginLeft: spacing(1),
    // marginRight: spacing(1),
  },
});

function EditableEvent(props) {
  const classes = useStyles();
  const { onClose, event, ...other } = props;
  event.address = event.address || {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
  };

  function handleClose() {
    onClose();
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xl"
      onClose={handleClose}
      {...other}
    >
      <DialogTitle onClose={handleClose}>
        Edit Event
      </DialogTitle>
      <DialogContent>

        {/* TODO: show image as button with overlayed edit icon */}
        {/* <ButtonBase
          focusRipple
          key={`${event.id}-image`}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: '100%',
          }}
        >
          <span
            className={classes.imageSrc}
            style={{
              backgroundImage: `url(${event.imageUrl || '/static/event.png'})`,
            }}
          />
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {event.name}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase> */}
        <CardMedia
          // className={classes.media}
          component="img"
          src={event.imageUrl || '/static/event.png'}
          title={event.name}
        />
        <Formik
          initialValues={event}
          validate={(values) => {
            const errors = {};
            // TODO: add field validation
            return errors;
          }}
          onSubmit={(values, bag) => {
            values.submit();
            // console.log('submitting', values, bag);
            // setTimeout(() => {
            //   setSubmitting(false);
            //   alert(JSON.stringify(values, null, 2));
            // }, 500);
          }}
        >
          {({ submitForm, isSubmitting, values }) => (
            <Form>
              <Field
                required
                id="name"
                name="name"
                label="Event Name"
                margin="normal"
                fullWidth
                component={TextField}
              />
              <br />
              <Field
                required
                id="description"
                name="description"
                label="Event description"
                margin="normal"
                fullWidth
                multiline
                component={TextField}
              />
              <br />
              <Field
                required
                id="start"
                name="start"
                label="Event start date/time"
                margin="normal"
                format="MMMM D, YYYY h:mm a"
                disablePast
                component={DateTimeField}
              />
              <br />
              <Field
                required
                id="end"
                name="end"
                label="Event end date/time"
                margin="normal"
                format="MMMM D, YYYY h:mm a"
                disablePast
                component={DateTimeField}
              />
              <br />
              <Field
                id="tbd"
                name="locationTBD"
                label="Location TBD"
                margin="normal"
                component={Checkbox}
              />
              <br />
              <Field
                id="locationName"
                name="locationName"
                label="Location Name"
                margin="normal"
                fullWidth
                component={TextField}
                disabled={!values.locationTBD}
              />
              <br />
              <Field
                id="addressLine1"
                name="address.line1"
                label="Line 1"
                margin="normal"
                fullWidth
                component={TextField}
              />
              <br />
              <Field
                id="addressLine2"
                name="address.line2"
                label="Line 2"
                margin="normal"
                fullWidth
                component={TextField}
              />
              <br />
              <Field
                id="addressCity"
                name="address.city"
                label="City"
                margin="normal"
                component={TextField}
              />
              <Field
                id="addressState"
                name="address.state"
                label="State"
                margin="normal"
                component={TextField}
              />
              <Field
                id="addressZip"
                name="address.zip"
                label="Zip"
                margin="normal"
                component={TextField}
              />
              <br />
              <Field
                id="url"
                name="url"
                label="Event URL (e.g. Facebook, website, registration)"
                margin="normal"
                fullWidth
                component={TextField}
              />

              <br />
              {isSubmitting && <LinearProgress />}
              <br />
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                className={classes.submitButton}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        {/* <Button onClick={this.handleSave} color="primary">
            Save
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}

// TODO: possibly add more specific validation functions
EditableEvent.propTypes = {
  onClose: PropTypes.func.isRequired,
  event: PropTypes.instanceOf(EventModel),
  open: PropTypes.bool.isRequired,
};

EditableEvent.defaultProps = {
  event: new EventModel(),
};

export default EditableEvent;
