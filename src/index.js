import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import './main.scss';

import TrackerApp from './TrackerApp';
import './scripts/slider';
import './scripts/scrollSpy';
import sendEmail from './scripts/sendEmail';
import { showGraph, showData } from './scripts/graph';

ReactDOM.render(
  <React.StrictMode>
    <TrackerApp />
  </React.StrictMode>,
  document.getElementById('tracker')
);

showGraph();
showData();

// Send message component
document.getElementById('form').addEventListener('submit', e => sendEmail(e));
