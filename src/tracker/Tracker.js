import React, { useState, useEffect } from 'react';
import trackerApp from './trackerApp';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import UserInfo from './components/UserInfo';
import Map from './components/Map';
import InfoItem from './components/InfoItem';
import DivsVisited from './components/DivsVisited';
import LinksVisited from './components/LinksVisited';
import Sessions from './components/Sessions';

const tracker = new trackerApp();

const Tracker = () => {
  const [user, setUser] = useState();
  const [ip, setIP] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');

  const [links, setLinks] = useState([]);
  const [divs, setDivs] = useState([]);
  const [divsFiltered, setDivsFiltered] = useState([]);
  const [sessions, setSessions] = useState();
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

    const populateUser = async () => {
      const res = await tracker.logUser();
      setUser(res);
    };

    populateUser();

    // Initialize optional trackers
    trackSessions();
    trackDivs();
    trackLinks();

    // eslint-disable-next-line
  }, []);

  // Set state of user object
  useEffect(() => {
    if (user) {
      setIP(user.ip);
      if (user.userLocation) {
        let { city, country, state, zip, lat, long } = user?.userLocation;
        setCity(city);
        setCountry(country);
        setState(state);
        setZip(zip);
        setLat(lat);
        setLong(long);
      }

      if (user.linksClicked) setLinks(user.linksClicked);

      if (user.divVisits) {
        setDivs(user.divVisits);

        // Filter out visits for less than 0.5s for simple display
        let filtered = user.divVisits.filter(d => d.timeOnDivSec > 0.4);
        setDivsFiltered(filtered);
      }

      if (user.sessions) setSessions(user.sessions);
      if (user.sessionsInfo) {
        setSessionCount(user.sessionsInfo.count);
        setSessionTime(parseInt(user.sessionsInfo.totalTime).toFixed(1));
      }
    }
  }, [user]);

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

    window.addEventListener('visibilitychange', async () => {
      // If user hides and comes back to page consider it a new session
      if (document.visibilityState === 'visible') {
        // Call getUserInfo when visible to reload user object for displaying sessions
        getUserInfo();
        // let u = await getUserInfo();
        // setUser(u);
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
      await fetch(`${tracker.apiURL}/logSession`, {
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

  async function getUserInfo() {
    try {
      const res = await axios.get(`${tracker.apiURL}/user`);

      const user = res.data;
      // console.log(user);
      setUser(user);
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
        <Grid item xs={4}>
          <UserInfo user={{ ip, country, state, city, zip }} />
        </Grid>
        <Grid item xs={8}>
          <Map lat={lat} long={long} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item>
          <p>Divs visited: </p>
          {divsFiltered && <DivsVisited divs={divsFiltered} />}
        </Grid>

        <Grid item xs={3}>
          <p>Links Clicked on: </p>
          <LinksVisited links={links} />
        </Grid>

        <Grid item xs={6}>
          <p>Sessions: </p>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <InfoItem title="Session Count" info={sessionCount} />
            </Grid>
            <Grid item xs={6}>
              <InfoItem
                title="Total time on page"
                info={sessionTime + ' Seconds'}
              />
            </Grid>
            <Grid item xs={12}>
              <Sessions />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Tracker;
