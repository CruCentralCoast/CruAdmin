import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardContent, Typography
} from '@material-ui/core';

const useStyles = makeStyles({
  cardControl: {
    width: '18vw',
    height: '20vw',
    minWidth: 275,
  }
});

// generate String to display group of leaders
const stringifyLeaderNames = (group) => {
  var str = "";
  str += group[0];
  for (var i = 1; i < group.length; i++) {
    str += ", " + group[i];
  }
  return str;
}

export default function CommunityGroupsCard(props) {
  const classes = useStyles();
  const { cg } = props;
  cg.leadersNamesString = stringifyLeaderNames(cg.leadersNames);
  
  // default to filtered to movement CRU
  return (
    <div>
      <Card className={classes.cardControl}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {cg.year}
          </Typography>
          <Typography component="p">
            {cg.gender}
          </Typography>
          <Typography component="p">
            {"Leaders: " + (cg.leadersNamesString || "TBD")}
          </Typography>
          <Typography component="p">
            {"Meets on: " + (cg.day || "TBD")}
          </Typography>
          <Typography component="p">
            {"Location: " + (cg.dorm || "TBD")}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}