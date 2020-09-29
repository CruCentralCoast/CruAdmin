import * as React from 'react';
import { Card, CardContent, CardMedia, Link, makeStyles, Typography
} from '@material-ui/core';

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
  const { mission } = props;

  // stores up to date values of Mission
  const [currMission] = React.useState(mission);

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
          <Link href={currMission.url} onClick={(event) => {event.preventDefault(); window.open(currMission.url);}}>
            Click for more info
          </Link>
        </CardContent>
      </Card>
    </div>
  );
} 