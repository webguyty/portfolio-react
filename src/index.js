import React from 'react';
import ReactDOM from 'react-dom';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import './main.scss';

import './scripts/slider';
import sendEmail from './scripts/sendEmail';
import { showGraph, showData } from './scripts/graph';
import Tracker from './tracker/Tracker';
import trackerApp from './tracker/trackerApp';

showGraph();
showData();

// Send message component
document.getElementById('form').addEventListener('submit', e => sendEmail(e));

const tracker = new trackerApp();

tracker.start();

console.log('thiasdfasd fasf' + tracker.user);

ReactDOM.render(
  <React.StrictMode>
    <Tracker />
  </React.StrictMode>,
  document.getElementById('tracker')
);
