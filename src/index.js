import React from 'react';
import ReactDOM from 'react-dom';
import Gumshoe from 'gumshoejs/dist/gumshoe.polyfills';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import './main.scss';

import './scripts/slider';
import sendEmail from './scripts/sendEmail';
import { showGraph, showData } from './scripts/graph';
import TrackerApp from './TrackerApp';

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

// Set up nav spy
const spy = new Gumshoe('#menu a', {
  offset: 200,
  nested: true,
});

document.addEventListener(
  'gumshoeActivate',
  e => {
    console.log(e.detail.content.id);
  },
  false
);
