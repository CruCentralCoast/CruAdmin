import * as React from 'react';
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, Typography, Button, Grid } from '@material-ui/core';
import {Formik, Field, Form} from 'formik';

const styles = style => ({
  root: {
    flexGrow: 1,
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
    marginTop: '10px',
  },
});

class EditableEvent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      id: props.event.id,
      name: props.event.name,
      description: props.event.description,
      image: props.event.image,
      locationName: props.event.location,
      address: {
        line1: null,
        line2: null,
        city: null,
        state: null,
        zip: null,
      },
      movements: props.event.movements,
      start: props.event.start,
      end: props.event.end,
      url: props.event.url,
    };
    this.open = props.open;
  }

  render() {
    const { classes } = this.props;
    const { event } = this.state;

    let start = moment.unix(this.state.start);
    let end = moment.unix(this.state.end);
    console.log(this.open);
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={this.open}
      >
        <DialogTitle onClose={this.handleCancel}>
          Edit Event
        </DialogTitle>
        <DialogContent>

          {// TODO: show image as button with overlayed edit icon
            /* <ButtonBase
            focusRipple
            key={image.title}
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
          >
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${image.url})`,
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
                {image.title}
                <span className={classes.imageMarked} />
              </Typography>
            </span>
          </ButtonBase> */}
          <Formik
            initialValues={this.state}
            validate={values => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Required';
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
              }
              return errors;
            }}
            onSubmit={(values, {setSubmitting}) => {
              setTimeout(() => {
                setSubmitting(false);
                alert(JSON.stringify(values, null, 2));
              }, 500);
            }}
            render={({submitForm, isSubmitting, values, setFieldValue}) => (
              <Form>
                <Field
                  name="email"
                  type="email"
                  label="Email"
                  component={UppercasingTextField}
                />
                <br />
                <Field
                  type="password"
                  label="Password"
                  name="password"
                  component={TextField}
                />
                <br />
                <FormControlLabel
                  control={
                    <Field label="Remember Me" name="rememberMe" component={Switch} />
                  }
                  label="Remember Me"
                />
                <br />
                <Field
                  type="text"
                  name="select"
                  label="With Select"
                  select
                  helperText="Please select Range"
                  margin="normal"
                  component={TextField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {ranges.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
                <br />
                <FormControl>
                  <InputLabel shrink={true} htmlFor="tags">
                    Tags
                  </InputLabel>
                  <Field
                    type="text"
                    name="tags"
                    component={Select}
                    multiple={true}
                    inputProps={{name: 'tags', id: 'tags'}}
                  >
                    <MenuItem value="dogs">Dogs</MenuItem>
                    <MenuItem value="cats">Cats</MenuItem>
                    <MenuItem value="rats">Rats</MenuItem>
                    <MenuItem value="snakes">Snakes</MenuItem>
                  </Field>
                </FormControl>
                <br />
                {isSubmitting && <LinearProgress />}
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Submit
                </Button>
              </Form>
            )}
          />
          <TextField
            required
            id="name"
            label="Event Name"
            defaultValue={event.name}
            margin="normal"
          />
          <TextField
            required
            id="name"
            label="Event Name"
            defaultValue={event.name}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="secondary">
              Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
              Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditableEvent);
