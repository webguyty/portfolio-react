import React, { useState, useEffect } from 'react';
import trackerApp from './trackerApp';
import axios from 'axios';

const tracker = new trackerApp();

const Tracker = props => {
  const [user, setUser] = useState();

  useEffect(() => {
    tracker.start();

    tracker.getUser().then(res => {
      setUser(res);
    });

    tracker.gsDivEnter();
    tracker.gsDivExit();
    tracker.linkListeners();
  }, []);

  //
  // API Calls
  //

  // tracker.getUser().then(res => {
  //   setUser(res);
  // });

  if (!user) {
    return (
      <div className="tracker">
        <p>Looking for user</p>
      </div>
    );
  }

  return (
    <div className="tracker">
      <p>User: {user.ip}</p>
    </div>
  );
};

export default Tracker;
