import * as React from 'react';
import './Event.css';
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, Typography, Button, Grid } from '@material-ui/core';

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
  }

  render() {
    const { classes } = this.props;
    const { event } = this.state;

    let start = moment.unix(this.state.start);
    let end = moment.unix(this.state.end);
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={this.state.open}
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
