import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/App';
import store from './app/store';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';

// This could theoretically be done by giving BrowserRouter a basename.
// I couldn't immediately make this work, though, so it's this for now.
const renderApp = () => {
  const notFound = () => (
    <div className="w-100 h-100 d-flex flex-row justify-content-center align-items-center">
      <h1>
        404
        {' '}
        <span role="img" aria-label="crying emoji">😭</span>
      </h1>
    </div>
  );

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <App />
          </Route>
          <Route path="/articulations/articulation-interface" exact>
            <App />
          </Route>
          <Route
            path="/articulations/articulation-interface/task/:taskName"
            render={({ match }) => <App taskName={match.params.taskName} />}
            exact
          />
          <Route
            path="/task/:taskName"
            render={({ match }) => <App taskName={match.params.taskName} />}
            exact
          />
          <Route>
            {notFound()}
          </Route>
        </Switch>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./app/App', renderApp);
}

renderApp();
