import * as React from 'react';
import { Card, CardContent, CardMedia, makeStyles, Typography
} from '@material-ui/core';

import { stringifyLeaderNames } from '../Helpers';
import { DESC_LIMIT } from '../constants';

const useStyles = makeStyles({
  cardControl: {
    width: '18vw',
    minWidth: 250,
    minHeight: 125
  }
});

// Represents a single card of Ministry Team
export default function MinistryTeamsCard(props) {
  const classes = useStyles();
  const { mt } = props;

  // stores up to date values of Ministry Team
  const [currMT] = React.useState(mt);

  const truncString = (str) => {
    if (str.length > DESC_LIMIT) {
      return str.substring(0, DESC_LIMIT) + "...";
    }
    return str;
  }
  currMT.leadersNamesString = stringifyLeaderNames(currMT.leadersNames);

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
      </Card>
    </div>
  );
}