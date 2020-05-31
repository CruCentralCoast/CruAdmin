import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography
} from '@material-ui/core';

import { stringifyLeaderNames } from '../Helpers';

const useStyles = makeStyles({
  cardControl: {
    width: '18vw',
    height: '20vw',
    minWidth: 275,
  }
});

// Represents a single card of Ministry Team
export default function MinistryTeamsCard(props) {
  const classes = useStyles();
  const { mt } = props;

  // stores up to date values of Ministry Team
  const [currMT] = React.useState(mt);

  currMT.leadersNamesString = stringifyLeaderNames(currMT.leadersNames);

  console.log("currMT ", currMT);
  return (
    <div>
      <Card className={classes.cardControl}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {currMT.name}
          </Typography>
          <Typography component="p">
            {"Leaders: " + (currMT.leadersNamesString || "TBD")}
          </Typography>
          <Typography component="p">
            {"Description: " + (currMT.description || "TDB")}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}