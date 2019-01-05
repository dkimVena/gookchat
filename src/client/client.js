import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import store from './store';
import Socket from './lib/Socket';

import './master.less';
import 'semantic-ui-css/semantic.min.css';

const socket = new Socket();

ReactDOM.render(
  <Provider store={store}>
    <App socket={socket} />
  </Provider>,
  document.getElementById('app')
);
