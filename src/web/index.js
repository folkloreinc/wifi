import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

const app = React.createElement(App, window.props || {});
ReactDOM.render(app, document.getElementById('app'));
