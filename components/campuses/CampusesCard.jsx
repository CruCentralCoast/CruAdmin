import * as React from 'react';
import { Card, CardContent, CardMedia, makeStyles, Typography
} from '@material-ui/core';

const useStyles = makeStyles({
  cardControl: {
    width: '18vw',
    minWidth: 250,
    minHeight: 125
  }
});

// Represents a single card of Campuses
export default function CampusesCard(props) {
  const classes = useStyles();
  const { campus } = props;

  // stores up to date values of a Campus
  const [currCampus] = React.useState(campus);

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
      </Card>
    </div>
  );
} 