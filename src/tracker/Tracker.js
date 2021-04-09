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
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [links, setLinks] = useState([]);
  const [divs, setDivs] = useState([]);
  const [divsFiltered, setDivsFiltered] = useState([]);
  const [sessions, setSessions] = useState({});
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  let divStats = {
    divName: '',
    enterTime: '',
    exitTime: '',
    divTime: '',
  };

  let sessionStats = {
    enterTime: '',
    exitTime: '',
  };

  //
  // Tracker initialization and state set up
  //
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

      if (res.divVisits) {
        setDivs(res.divVisits);
        // Filter out visits for less than 0.5s for simple display
        let filtered = res.divVisits.filter(d => d.timeOnDivSec > 0.4);
        setDivsFiltered(filtered);
      }

      if (res.sessions) setSessions(res.sessions);
      if (res.sessionsInfo) {
        setSessionCount(res.sessionsInfo.count);
        setSessionTime(res.sessionsInfo.totalTime);
      }
    })();

    // Initialize optional tracker
    trackSessions();
    trackDivs();
    trackLinks();
  }, []);

  // Filter out div's in FE with less than 0.5s for display
  useEffect(() => {
    let filtered = divs.filter(d => d.timeOnDivSec > 0.5);
    setDivsFiltered(filtered);
  }, [divs]);

  //
  // Tracker functionality + state management
  //

  function trackSessions() {
    // add start time for session tracking
    let now = new Date();
    sessionStats.enterTime = now.toISOString();

    window.addEventListener('visibilitychange', () => {
      // If user hides and comes back to page consider it a new session
      if (document.visibilityState === 'visible') {
        sessionStats.enterTime = new Date().toISOString();
      }

      // If user leaves or hides page send logSession API call
      if (document.visibilityState === 'hidden') {
        sessionStats.exitTime = new Date().toISOString();

        logSession(sessionStats);

        sessionStats.enterTime = '';
        sessionStats.exitTime = '';
      }
    });
  }

  //
  // Gumshoe - div and link tracking
  //

  function trackDivs() {
    // Configure for reading first div 'header' when page loads. If page is reloaded a reload message will appear
    divStats.divName = 'header';
    let now = new Date();
    divStats.enterTime = now.toISOString();

    // Add event listeners to log div time with Gumshoe
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
      },
      false
    );

    // When div becomes deactive on screen, deactivate Gumshoe
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

        divStats = {};
      },
      false
    );
  }

  // Event listeners for links
  function trackLinks() {
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
  async function logSession(info) {
    try {
      const res = await fetch(`${tracker.apiURL}/logSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
        keepalive: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

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

      <Grid container spacing={3}>
        <Grid item>
          <p>Divs visited: </p>
          {divsFiltered && <DivsVisited divs={divsFiltered} />}
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
