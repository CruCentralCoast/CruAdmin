import * as React from 'react';
import * as ReactDOM from 'react-dom';
// Import routing components
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Heading from './components/heading/Heading';
import App from './components/App';
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
      <Route exact path="/:collection" component={App} />
      <Route exact path="/" component={App} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
registerServiceWorker();
