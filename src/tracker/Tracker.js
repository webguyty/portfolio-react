import React, { useState, useEffect } from 'react';
import trackerApp from './trackerApp';
import axios from 'axios';

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

    // Wait 1 second for userLocation to finish loading
    setTimeout(() => {
      tracker.getUser().then(res => {
        setIP(res.ip);
        console.log(res.userLocation);
        let { city, country, state, zip } = res.userLocation;
        setCity(city);
        setCountry(country);
        setState(state);
        setZip(zip);

        if (res.linksClicked) {
          setLinks(res.linksClicked);
        }

        if (res.divVisits) {
          setDivs(res.divVisits);
        }

        if (isMounted) setUser(res);
      });
    }, 1000);

    // Initialize tracker
    gsDivEnter();
    gsDivExit();
    linkListeners();

    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
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
      // update component state
      // ps = previous state
      // setUser(ps => ({
      //   ...ps,
      //   divVisits: [...ps.divVisits, div],
      // }));
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
