import React, { useState } from 'react';
import trackerApp from './trackerApp';
import axios from 'axios';

const tracker = new trackerApp();

const Tracker = props => {
  let x;
  tracker.getUser().then(res => {
    x = res;
  });

  return (
    <div className="tracker">
      <p>User: </p>
    </div>
  );
};

export default Tracker;
