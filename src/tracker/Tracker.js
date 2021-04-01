import React, { useState, useEffect } from 'react';
import trackerApp from './trackerApp';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import UserInfo from './components/UserInfo';
import DivsVisited from './components/DivsVisited';
import LinksVisited from './components/LinksVisited';

const tracker = new trackerApp();

const Tracker = () => {
  const [user, setUser] = useState({});
  const [ip, setIP] = useState('');
  const [city, setCity] = useState('asdf');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [links, setLinks] = useState([]);
  const [divs, setDivs] = useState([]);

  let divStats = {
    divName: '',
    enterTime: '',
    exitTime: '',
    divTime: '',
  };

  useEffect(() => {
    tracker.start();

    (async () => {
      const res = await tracker.logUser();
      setUser(res);
      setIP(res.ip);
      let { city, country, state, zip } = res.userLocation;
      setCity(city);
      setCountry(country);
      setState(state);
      setZip(zip);

      if (res.linksClicked) setLinks(res.linksClicked);

      if (res.divVisits) setDivs(res.divVisits);
    })();

    // Initialize tracker
    gsDivEnter();
    gsDivExit();
    linkListeners();
  }, []);

  //
  // Event listeners
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
        // clear the div
        divStats = {};
      },
      false
    );
  }

  // Event listeners for links
  function linkListeners() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
      link.addEventListener('click', e => {
        logLink({ link: link.href });
      });
    });
  }

  //
  // API Calls
  //

  async function logDiv(info) {
    try {
      const res = await axios.patch(
        `${tracker.apiURL}/logDiv`,
        info,
        tracker.axiosConfig
      );
      const div = res.data;

      setDivs(ps => [...ps, div]);
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

      let link = res.data;
      // For state
      setLinks(ps => [...ps, link]);
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
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <UserInfo title="User" info={ip} />
        </Grid>
        <Grid item xs={2}>
          <UserInfo title="Country" info={country} />
        </Grid>
        <Grid item xs={2}>
          <UserInfo title="State" info={state} />
        </Grid>
        <Grid item xs={2}>
          <UserInfo title="City" info={city} />
        </Grid>
        <Grid item xs={2}>
          <UserInfo title="Zip" info={zip} />
        </Grid>
      </Grid>

      {/* <p>Links Clicked: </p>
      <ul>
        {links.map(l => (
          <li>{l}</li>
        ))}
      </ul> */}
      <Grid container spacing={3}>
        <Grid item>
          <p>Divs visited: </p>
          <DivsVisited divs={divs} />
        </Grid>
        <Grid item>
          <p>Links Clicked on: </p>
          <LinksVisited links={links} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Tracker;
