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
} from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

const useStyles = makeStyles({
  submitButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#ffffff',
    backgroundColor: '#007398',
  },
});

function EditableEvent(props) {
  const classes = useStyles();
  const { onClose, event, ...other } = props;
  const start = moment.unix(event.start);
  const end = moment.unix(event.end);
  console.log(event);

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
        >
          <span
            className={classes.imageSrc}
            style={{
              backgroundImage: `url(${event.imageUrl})`,
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
          src={event.image || '/static/event.png'}
          title={event.name}
        />
        <Formik
          initialValues={event}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
              errors.email = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              setSubmitting(false);
              alert(JSON.stringify(values, null, 2));
            }, 500);
          }}
          render={({
            submitForm, isSubmitting, values, setFieldValue,
          }) => (
            <Form>
              <Field
                required
                id="name"
                name="name"
                label="Event Name"
                value={event.name}
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
                value={event.description}
                margin="normal"
                fullWidth
                multiline
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
        />
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
  event: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    locationName: PropTypes.string.isRequired,
    address: {
      line1: PropTypes.string.isRequired,
      line2: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
    },
    movements: PropTypes.array.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
};

export default EditableEvent;
