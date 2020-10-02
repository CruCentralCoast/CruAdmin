import * as React from 'react';
import * as ReactDOM from 'react-dom';
// Import routing components
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Heading from './components/heading/Heading';
import App from './components/App';
import Campuses from '../pages/campuses';
import CommunityGroups from '../pages/community-groups';
import Events from '../pages/events';
import MinistryTeams from '../pages/ministry-teams';
import Missions from '../pages/missions';
import Resources from '../pages/resources';
import NotFound from './components/notFound/NotFound';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" component={Heading} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('heading'),
);

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" component={App} />
      <Route path="/events" component={Events} />
      <Route path="/campuses" component={Campuses} />
      <Route path="/community-groups" component={CommunityGroups} />
      <Route path="/ministry-teams" component={MinistryTeams} />
      <Route path="/missions" component={Missions} />
      <Route path="/resources" component={Resources} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
registerServiceWorker();
