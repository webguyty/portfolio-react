import React, { useState, useEffect } from 'react';
import trackerApp from './trackerApp';
import axios from 'axios';

const tracker = new trackerApp();

const Tracker = props => {
  const [user, setUser] = useState();

  let divStats = {
    divName: '',
    enterTime: '',
    exitTime: '',
    divTime: '',
  };

  useEffect(() => {
    tracker.start();

    tracker.getUser().then(res => {
      setUser(res);
    });

    gsDivEnter();
    gsDivExit();
    linkListeners();
  }, []);

  //
  // API Calls
  //

  //
  // Gumshoe - div and link tracking
  // Add event listeners to log div time with Gumshoe
  function gsDivEnter() {
    // When div becomes active on screen, activate Gumshoe
    document.addEventListener(
      'gumshoeActivate',
      event => {
        // Div name
        const divID = event.detail.content.id;
        divStats.divName = divID;

        // Div enter time
        let now = new Date();
        divStats.enterTime = now.toISOString();

        // Pass time through callback for state in react component
        // if (cb) cb(now);
      },
      false
    );
  }
  // When div becomes deactive on screen, deactivate Gumshoe
  function gsDivExit() {
    document.addEventListener(
      'gumshoeDeactivate',
      event => {
        const divID = event.detail.content.id;
        let now = new Date();
        now = now.toISOString();

        // If things are are working correctly give exit time
        if (divID === divStats.divName) {
          // Div exit time
          divStats.exitTime = now;
        } else {
          // Create a divStats object that had to result from page reload or some type of error
          divStats.divName = `${divID} - page reloaded`;
          divStats.enterTime = now;
          divStats.exitTime = now;
        }

        logDiv(divStats);

        // Pass divStats into cb for state in react
        // if (cb) cb(divStats);

        divStats = {};
      },
      false
    );
  }

  // Event listeners for links
  function linkListeners(cb) {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
      link.addEventListener('click', e => {
        logLink({ link: link.href });

        // cb for state in react
        // if (cb) cb(link.href);
      });
    });
  }

  async function logDiv(info) {
    try {
      const res = await axios.patch(
        `${tracker.apiURL}/logDiv`,
        info,
        tracker.axiosConfig
      );

      // console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  async function logLink(info) {
    try {
      const res = await axios.patch(
        `${tracker.apiURL}/logLink`,
        info,
        tracker.axiosConfig
      );

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  if (!user) {
    return (
      <div className="tracker">
        <p>Looking for user</p>
      </div>
    );
  }

  return (
    <div className="tracker">
      <p>
        User: {user.ip}, County: {user.userLocation.country}, State:{' '}
        {user.userLocation.state}, City: {user.userLocation.city}, Zip:{' '}
        {user.userLocation.zip}
      </p>
      <p>Links Clicked: </p>
      {/* <ul>{user.linksClicked && user.linksClicked.map(l => <li>{l}</li>)}</ul> */}
    </div>
  );
};

export default Tracker;
