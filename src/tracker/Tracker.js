import React, { useState, useEffect } from 'react';
import trackerApp from './trackerApp';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import UserInfo from './components/UserInfo';

const tracker = new trackerApp();

const Tracker = () => {
  const [user, setUser] = useState({});
  const [ip, setIP] = useState('');
  // const [userLocation, setUserLocation] = useState({});
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [links, setLinks] = useState([]);
  const [divs, setDivs] = useState([]);
  // const [zip, setZip] = useState('');
  // const [zip, setZip] = useState('');

  let divStats = {
    divName: '',
    enterTime: '',
    exitTime: '',
    divTime: '',
  };

  useEffect(() => {
    tracker.start();

    let isMounted = true;

    tracker.getUser().then(res => {
      // setUser(res);

      if (isMounted) {
        setUser(res);
        setIP(res.ip);
        setCity(res.userLocation.city);
        setCountry(res.userLocation.country);
        setState(res.userLocation.state);
        setZip(res.userLocation.zip);
      }
    });

    // setUserLocation(user.userLocation);
    // console.log();

    if (user.linksClicked) {
      setLinks(user.linksClicked);
    }

    if (user.divVisits) {
      setDivs(user.divVisits);
    }

    // Initialize tracker
    gsDivEnter();
    gsDivExit();
    linkListeners();

    return () => {
      isMounted = false; // use effect cleanup to set flag false, if unmounted
    };
  }, []);

  // useEffect(() => {
  //   // let { city, country, state, zip } = userLocation;
  //   setIP(user.ip);
  //   setCity(user.userLocation.city);
  //   setCountry(user.userLocation.country);
  //   setState(user.userLocation.state);
  //   setZip(user.userLocation.zip);
  //   // if (user.userLocation) {
  //   //   if (user.userLocation) setIP(user.ip);
  //   //   if (user.userLocation.city) setCity(user.userLocation.city);
  //   //   if (user.userLocation.country) setCountry(user.userLocation.country);
  //   //   if (user.userLocation.state) setState(user.userLocation.state);
  //   //   if (user.userLocation.zip) setZip(user.userLocation.zip);
  //   // }
  //   // setCity(city);
  //   // setCountry(country);
  //   // setState(state);
  //   // setZip(zip);
  // }, [user.userLocation]);

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
      {/* User Information */}
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
      <p>
        User: {ip}, County: {country}, State: {state}, City: {city}, Zip: {zip}
      </p>
      {/* <p>Links Clicked: </p>
      <ul>
        {links.map(l => (
          <li>{l}</li>
        ))}
      </ul> */}
      <p>Divs visited: </p>
      <ul>
        {divs.map(d => (
          <li>{JSON.stringify(d)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tracker;
