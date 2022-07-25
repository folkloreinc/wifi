import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';

const container = document.getElementById('app');
const app = React.createElement(App, window.props || {});
const root = createRoot(container);
root.render(app);
